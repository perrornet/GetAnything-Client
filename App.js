/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, TouchableOpacity, Alert} from 'react-native';

type Props = {};

export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this._onEndEditing = this._onEndEditing.bind(this);
    this.state = {
      showValue:"",
    };
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
            Alert.alert(data.data.info[0].title, "视频下载链接：" + data.data.info[0].url);
            console.error("fdsafdsa")
          }
        })
        .catch(error => {
          console.error(error);
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
