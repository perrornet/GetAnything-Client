import React from 'react';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './home'
import SettingScreen from './setting'
import AboutScreen from './about'

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Setting: SettingScreen,
    About: AboutScreen,
  },
  {
    initialRouteName: 'Home',
      headerMode: "none",
      headerBackTitleVisible: true
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
