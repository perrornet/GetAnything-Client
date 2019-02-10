import React from 'react';

import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Clipboard,
    CameraRoll,
    ListView
} from 'react-native';
import RNFS from "react-native-fs";
import Toast from 'react-native-easy-toast'
import ActionButton from 'react-native-action-button';
import Config from '../config'
const readUrl = {};

export default class HomeScreen extends React.Component {
    constructor(props){
    super(props);
    this._onEndEditing = this._onEndEditing.bind(this);
    this.state = {
      showValue:"",
    };
  }

  downloadFile(url, type, headers, title, index) {
    if (type == "" || type == null || type == undefined){
      type = "mp4"
    }
    if (index == 0){
        index = ""
    }
    var fileName = `${title.replace("：", "")}${index}.${type}`;
    const downloadDest = `${Config.download_path}/${fileName}`;
    const options = {
      headers:headers,
      fromUrl: url,
      toFile: downloadDest,
      background: true,
      begin: (res) => {
        Config.DownloadInfo[fileName] = {
          total:res.contentLength,
          downloadBytes:0,
        }
      },
      progress: (res) => {
          Config.DownloadInfo[fileName].downloadBytes = res.bytesWritten
      }
    };
    try {
      const ret = RNFS.downloadFile(options);
      ret.promise.then(resp => {
        CameraRoll.saveToCameraRoll(`flie://${downloadDest}`).then((result) => {
            this.refs.toast.show(`]${fileName}]已保存至相册`, 2000)
        })
      }).catch(err => {
        if (err.toString().match("such file") != null){
          Alert.alert("客户端错误", "请在设置->授权管理->应用权限管理中打开'读写手机存储'权限后重试！" + downloadDest)
        }
      });
    }
    catch (e) {
      this.refs.toast.show(`文件下载出现错误:${e}`, 3000);
    }

  }

  _onEndEditing(event){
    //把获取到的内容，设置给showValue
    this.setState({showValue:event.nativeEvent.text});
    this.getMoviesFromApiAsync()
  }

  _onChangeText(inputData){
    //把获取到的内容，设置给showValue
    this.setState({showValue:inputData});
  }

  getMoviesFromApiAsync() {

    if (this.state.showValue.match("http") == null || this.state.showValue.substring(0, 4) != "http"){
      Alert.alert("", "输入的URL不合法，正确的URL应该以http或https开头");
      return null
    }
    var fromData = new FormData();
    fromData.append("url", this.state.showValue);
    console.warn(`${Config.host + Config.server_download_path}`);
    Promise.race([
    fetch(`${Config.host + Config.server_download_path}`, {
      method:"POST",
      body:fromData
    }).then(response => response.json())
        .then(data => {
          if (data.code != 0){
               // console.error(data);
            Alert.alert("服务器错误", data.msg);
          }else{
            this.refs.toast.show(`总计${data.data.info.length}个文件，开始下载`,2000);
            for (var i = 0; i < data.data.info.length; i++){
              this.downloadFile(data.data.info[i].url, data.data.info[i].type, data.data.headers, data.data.info[i].title, i);
            }
          }
        }).catch(error => {
          Alert.alert("客户端错误", "检查服务器配置以及本地网络连接！")
        }),
    new Promise(function(resolve,reject){
        setTimeout(()=> reject(new Error('request timeout')),2000)
    })])
    .then((data)=>{
        //请求成功
    }).catch(()=>{
        //请求失败
    });
  }
    async _setClipboardContent(){
        try {
            var content = await Clipboard.getString();
            if (readUrl[content] != undefined){
              return
            }
            readUrl[content] = 0;
            if (content != undefined && content != "" && content.substring(0, 4) == "http"){
                Alert.alert("是否根据您复制的网址开始下载？", content, [
              {text:"下载", onPress:()=>{
                this.setState({showValue:content});
                this.getMoviesFromApiAsync()
                }},
              {text:"取消"},
            ])
            }
        } catch (e) {
            this.setState({content:e.message});
        }
    };

  componentDidMount(){
    this._setClipboardContent();
  }
  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.log}>Get anything</Text>
          <TextInput style={styles.textInput}  underlineColorAndroid={'transparent'} editable={true} onChangeText={this._onChangeText.bind(this)} onEndEditing={this._onEndEditing.bind(this)} placeholder="输入需要下载视频的链接" placeholderTextColor="#6ee6ff" />
          <TouchableOpacity  style={styles.touchButton} onPress={this.getMoviesFromApiAsync.bind(this)}>
            <Text style={styles.touchButtonText}>下载</Text>
          </TouchableOpacity>
          <Toast  //提示
              ref="toast"
              style={{backgroundColor:'gray'}}
              position='center'
              positionValue={200}
              opacity={0.6}
              textStyle={{color:'white'}}
          />

          <ActionButton buttonColor="rgba(231,76,60,1)" offsetX={10} offsetY={50} buttonText="更多" buttonTextStyle={styles.buttonTextStyle}>
              <ActionButton.Item buttonColor='#3498db' onPress={() => {
                          fetch("https://raw.githubusercontent.com/PerrorOne/GetAnything-Server/master/README.md", {
                        method: "GET",
                    }).then(response => response.text()).then(data => {
                        var webList = data.match(/\*\*(.*?)\*\*/g);
                        for (var i = 0; i < webList.length; i++) {
                            webList[i] = webList[i].replace(/\*\*/g, "")
                        }
                        Alert.alert("支持列表", webList.join(","))

                    })
              }
              }>
              <Text  style={styles.actionButtonIcon} >支持网站</Text>
            </ActionButton.Item>

            <ActionButton.Item buttonColor='#3498db' onPress={() => {this.props.navigation.navigate("Setting")}}>
              <Text  style={styles.actionButtonIcon} >设置</Text>
            </ActionButton.Item>

            <ActionButton.Item buttonColor='#1abc9c' onPress={() => {this.props.navigation.navigate("About")}}>
              <Text style={styles.actionButtonIcon} >关于</Text>
            </ActionButton.Item>

          </ActionButton>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop: Config.height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdffff',
  },
  textInput: {
    fontSize: 15,
    marginTop: Config.height * 0.1,
    height: Config.height * 0.2,
    width: Config.width * 0.55,
    marginBottom: 5,
    backgroundColor: '#fdffff',
    textAlign: 'center',
    alignItems: 'center',
  },
  log:{
    fontSize: 40,
    textAlign: 'center',
    fontFamily: "Biligyar",
  },
  touchButton: {
    height: Config.height * 0.05,
    width: Config.width * 0.2,
    borderRadius: 20,
    backgroundColor: '#fa1faa',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  touchButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  actionButtonIcon: {
    color: 'white',
    textAlign: 'center',
  },
  buttonTextStyle:{
    fontSize: 15,
    textAlign: 'center',
  }
});
