import React from 'react';
import {View, StyleSheet, Text, ListView, Linking, TouchableWithoutFeedback} from 'react-native';
import Config from '../config'


const styles = StyleSheet.create({
  container: {
      marginTop: Config.height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdffff',
  },
  Text:{
      marginTop: Config.height * 0.01,
      textAlign: 'left',
  },
    Text1:{
      color:"#3b17ff"
    },
    log:{
    fontSize: 40,
    textAlign: 'center',
    fontFamily: "Biligyar",
    color:"#3b17ff",
  },
});


export default class AboutScreen extends React.Component {
    constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        dataSource:ds.cloneWithRows([
        'react-native', 'react-native-vector-icons', 'react-native-action-button', 'react-native-easy-toast', 'react-native-fs',
      ])
    };
  }
    render(): React.ReactNode {
        return (<View style={styles.container}>
            <TouchableWithoutFeedback onPress={() =>{Linking.openURL("https://github.com/PerrorOne/GetAnything-Client")}}>
                    <Text style={styles.log}>Get anything</Text>
                </TouchableWithoutFeedback>
            <Text>
                是一款开源的、免费、支持IOS、Android、自定义服务器，可以从移动端或者WEB端获取媒体资源的软件。
            </Text>
            <Text>
                如果没能支持您需要下载资源的APP、网站或者有任何问题，您可以点击上方蓝色字体提issues。
            </Text>
            <Text style={styles.Text}>
                GetAnything使用的开源项目列表:
            </Text>
            <TouchableWithoutFeedback onPress={() =>{Linking.openURL("https://facebook.github.io/react-native/")}}>
                    <Text style={styles.Text1}>react-native</Text>
                </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() =>{Linking.openURL("https://github.com/oblador/react-native-vector-icons")}}>
                    <Text style={styles.Text1}>react-native-vector-icons</Text>
                </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() =>{Linking.openURL("https://github.com/mastermoo/react-native-action-button")}}>
                    <Text style={styles.Text1}>react-native-action-button</Text>
                </TouchableWithoutFeedback>
             <TouchableWithoutFeedback onPress={() =>{Linking.openURL("https://github.com/crazycodeboy/react-native-easy-toast")}}>
                    <Text style={styles.Text1}>react-native-easy-toast</Text>
                 </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() =>{Linking.openURL("https://github.com/itinance/react-native-fs")}}>
                    <Text style={styles.Text1}>react-native-fs</Text>
                </TouchableWithoutFeedback>

        </View>)
    }
}