import RNFS from "react-native-fs";
import {PermissionsAndroid} from 'react-native';

var dimensions = require('Dimensions');

async function requestCameraPermission() {
  try {
    var granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
    granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

requestCameraPermission();

const Config = {
  "download_path":  RNFS.ExternalDirectoryPath,
    "conf_file_path": `${RNFS.ExternalDirectoryPath}/.GetAnything.Conf`,
  "host": "http://23ss464660.iok.la",
    "default_host":"http://23ss464660.iok.la",
    "server_download_path": "/GetVideoUrl",
    "server_alive": "/",
  "width":dimensions.get('window').width,
  "height":dimensions.get('window').height,
  "DownloadInfo": [],
};

function reloadConf(){
     RNFS.readFile(Config.conf_file_path).then((data) =>{
        Config.host = data
    }).catch((err) => {
        // 创建文件
         console.error(err);
        RNFS.writeFile(Config.conf_file_path, Config.host)
    });
}
reloadConf();
module.exports = Config;