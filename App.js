/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, TouchableOpacity, Alert} from 'react-native';
import RNFS from 'react-native-fs'

type Props = {};

var fileType = {
  "video/3gpp": "3gp",
  "video/f4v": "flv",
  "video/mp4": "mp4",
  "video/MP2T": "ts",
  "video/quicktime": "mov",
  "video/webm": "webm",
  "video/x-flv": "flv",
  "video/x-ms-asf": "asf",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/wave": "wav",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "application/pdf": "pdf"
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
    // todo: 修改目录， 使得文件下载到同一的文件夹
    const downloadDest = `${RNFS.ExternalStorageDirectoryPath}/GetAnything_${title}.${type}`;
    const formUrl = url;
    const options = {
      headers:headers,
      fromUrl: formUrl,
      toFile: downloadDest,
      background: true,
      progress: (res) => {
        let pro = res.bytesWritten / res.contentLength;
        this.setState({
          progressNum: pro,
        });
      }
    };
    try {
      const ret = RNFS.downloadFile(options);
      ret.promise.then(res => {
        Alert.alert("下载完成", "文件保存地址：" + downloadDest);
      }).catch(err => {
        Alert.alert("", "文件下载出现错误：", err);
      });
    }
    catch (e) {
      console.warn(error);
    }

  }


  DownloadFormUrl(url, title, headers){
    fetch(url, {method:"HEAD", headers: headers}).then(
        response => {
          console.warn(url);
          var _type = fileType[response.headers["map"]["content-type"]];
          if (_type == null){
            Alert.alert("错误", "暂时不支持该类型文件下载！:" + response.headers["map"]["content-type"])
          }else{
            Alert.alert("", "文件开始下载...");
            this.downloadFile(url, _type, headers, title)
          }
        }
    );
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
    return fetch("http://23ss464660.iok.la/GetVideoUrl", {
      method:"POST",
      body:fromData
    })
        .then(response => response.json())
        .then(data => {
          if (data.code != 0){
            Alert.alert("", data.msg)
          }else{
            for (var i = 0; i < data.data.info.length; i++){
              this.DownloadFormUrl(data.data.info[i].url, data.data.info[i].title, data.data.headers);
            }
          }
        })
        .catch(error => {
          var err_string = error.toString();
          if (err_string.match("undefined is not an object") != null){
            Alert.alert("error", "检查服务器配置以及本地网络连接！")
          }else if (err_string.match("JSON Parse error") != null){
            Alert.alert("error", "检查服务器配置以及本地网络连接！")
          }else{
            console.error(error)
          }
        });
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.log}>Get anything</Text>
          <TextInput style={styles.textInput}  underlineColorAndroid={'transparent'} editable={true} onChangeText={this._onChangeText.bind(this)} onEndEditing={this._onEndEditing.bind(this)} placeholder="输入需要下载视频的链接"  />
          <TouchableOpacity style={styles.touchButton} onPress={this.getMoviesFromApiAsync.bind(this)}>
            <Text style={styles.touchButtonText}>下载</Text>
          </TouchableOpacity>
        </View>
    );
  }
}

var dimensions = require('Dimensions');
//获取屏幕的宽度和高度
var {width,height} = dimensions.get('window');
width = width / 2;

const styles = StyleSheet.create({
  container: {
    marginTop: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    fontSize: 15,
    marginTop: 80,
    height: 80,
    width: width + 100,
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
    height: 40,
    width: 100,
    borderRadius: 20,
    backgroundColor: '#fa1faa',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  touchButtonText: {
    color: 'white',
    textAlign: 'center',
  }
});
