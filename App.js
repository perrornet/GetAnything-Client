/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, TouchableHighlight} from 'react-native';
import RNFS from "react-native-fs";
import Toast from 'react-native-easy-toast'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {};

const config = {
  "download_path": RNFS.ExternalStorageDirectoryPath,
  "host": "http://23ss464660.iok.la",
};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this._onEndEditing = this._onEndEditing.bind(this);
    this.state = {
      showValue:"",
    };
  }
  downloadFile(url, type, headers, title) {
    if (type == "" || type == null || type == undefined){
      type = "mp4"
    }
    // todo: 修改目录， 使得文件下载到同一的文件夹
    const downloadDest = `${config.download_path}/GetAnything_${title.replace("：", "")}_${Math.random()}.${type}`;
    const options = {
      headers:headers,
      fromUrl: url,
      toFile: downloadDest,
      background: true,
      begin: (res) => {
      }
    };
    try {
      const ret = RNFS.downloadFile(options);
      ret.promise.then(resp => {
        this.refs.toast.show(`文件下载成功, 储存目录:${downloadDest}`, 1000);
      }).catch(err => {
        if (err.toString().match("such file") != null){
          Alert.alert("客户端错误", "请在设置->授权管理->应用权限管理中打开'读写手机存储'权限后重试！")
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
    return fetch(`${config.host}/GetVideoUrl`, {
      method:"POST",
      body:fromData
    })
        .then(response => response.json())
        .then(data => {
          if (data.code != 0){
            Alert.alert("服务器错误", data.msg)
          }else{
            this.refs.toast.show(`总计${data.data.info.length}个文件，开始下载`,2000);
            for (var i = 0; i < data.data.info.length; i++){
              this.downloadFile(data.data.info[i].url, data.data.info[i].type, data.data.headers, data.data.info[i].title);
            }
          }
        })
        .catch(error => {
          var err_string = error.toString();
          if (err_string.match("undefined is not an object") != null){
            Alert.alert("客户端错误", "检查服务器配置以及本地网络连接！")
          }else if (err_string.match("JSON Parse error") != null){
            Alert.alert("客户端错误", "检查服务器配置以及本地网络连接！")
          }else{
            Alert.alert("客户端错误", error)
          }
        });
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.log}>Get anything</Text>
          <TextInput style={styles.textInput}  underlineColorAndroid={'transparent'} editable={true} onChangeText={this._onChangeText.bind(this)} onEndEditing={this._onEndEditing.bind(this)} placeholder="输入需要下载视频的链接" placeholderTextColor="#6ee6ff" />
          <TouchableOpacity style={styles.touchButton} onPress={this.getMoviesFromApiAsync.bind(this)}>
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
          {/* Rest of the app comes ABOVE the action button component !*/}
          <ActionButton buttonColor="rgba(231,76,60,1)" offsetX={10} offsetY={50} buttonText="更多" buttonTextStyle={styles.buttonTextStyle}>

            <ActionButton.Item buttonColor='#9b59b6'  onPress={() => console.log("notes tapped!")}>
              <TouchableHighlight
                  style={{padding: 10}}
                  onPress={()=>{
                    this.refs.toast.show('hello worsssld!');
                  }}>
              <Icon name="md-create" style={styles.actionButtonIcon} >已下载</Icon>
              </TouchableHighlight>
            </ActionButton.Item>


            <ActionButton.Item buttonColor='#3498db' onPress={() => {}}>
              <Icon name="md-notifications-off" style={styles.actionButtonIcon} >设置</Icon>
            </ActionButton.Item>

            <ActionButton.Item buttonColor='#1abc9c' onPress={() => {}}>
              <Icon name="md-done-all" style={styles.actionButtonIcon} >关于</Icon>
            </ActionButton.Item>
          </ActionButton>

        </View>
    );
  }
}

var dimensions = require('Dimensions');
//获取屏幕的宽度和高度
var {width,height} = dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    fontSize: 15,
    marginTop: height * 0.1,
    height: height * 0.2,
    width: width * 0.55,
    marginBottom: 5,
    backgroundColor: '#F5FCFF',
    textAlign: 'center',
    alignItems: 'center',
  },
  log:{
    fontSize: 40,
    textAlign: 'center',
    fontFamily: "Biligyar",
  },
  touchButton: {
    height: height * 0.05,
    width: width * 0.2,
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
