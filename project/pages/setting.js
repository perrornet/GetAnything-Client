import React from 'react';
import {View, StyleSheet, TextInput, Text, TouchableOpacity, Alert} from 'react-native';
import Config from '../config'
import RNFS from "react-native-fs";
import Toast from 'react-native-easy-toast'
const styles = StyleSheet.create({
  container: {
      marginTop: Config.height * 0.15,
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
    touchButton: {
    height: Config.height * 0.05,
    width: Config.width * 0.2,
    borderRadius: 20,
    backgroundColor: '#fa1faa',
    justifyContent: 'center',
    overflow: 'hidden',
  },touchButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});


export default class SettingScreen extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      Value:"",
        reload:"",
    };
  }


  _onChangeText(inputData){
    //把获取到的内容，设置给showValue
    this.setState({Value:inputData});
  }

  changeConf(){
        if (this.state.Value == undefined){
            Alert.alert("修改配置出错", "请填写要修改的服务器HOST");
            return
        }
        console.warn(this.state.Value);
        if (this.state.Value.match("http") == null || this.state.Value.substring(0, 4) != "http"){
            Alert.alert("修改配置出错", "输入Host非法，应该以http或https开头，示例:http://23ss464660.iok.la")
            return
        }
        // 连接服务器测试是否可用
        fetch(`${Config.host + Config.server_alive}`, {
            method:"GET",
        }).then(response => response.text()).then(data => {
            console.warn(data);
            if (data == "ok"){
                RNFS.writeFile(`${RNFS.ExternalDirectoryPath}/GetAnything.Conf`, Config.host);
                Config.host = this.state.Value;
                this.refs.toast.show(`已修改服务器Host:${Config.host}`, 3000);
            }else{
                Alert.alert("修改配置失败", `${this.state.Value}服务器未能响应，请检查服务是否启动。`)
            }
        });

  }
    render(): React.ReactNode {
        var host = `host:${Config.host}`;
        return (<View style={styles.container}>
            <Toast  //提示
              ref="toast1"
              style={{backgroundColor:'gray'}}
              position='center'
              positionValue={200}
              opacity={0.6}
              textStyle={{color:'white'}}
          />
            <TextInput style={styles.textInput}  underlineColorAndroid={'transparent'} onChangeText={this._onChangeText.bind(this)} onEndEditing={this._onChangeText.bind(this)} editable={true}  placeholder={host} placeholderTextColor="#6ee6ff" />
            <TouchableOpacity style={styles.touchButton} onPress={this.changeConf.bind(this)}>
            <Text style={styles.touchButtonText} >修改</Text>
          </TouchableOpacity>
        </View>)
    }
}