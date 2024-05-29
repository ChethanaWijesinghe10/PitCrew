import { View, Text } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import AppNavigation from './src/navigations/AppNavigation';
import { sty } from './src/styles/Styles';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './src/navigations/DrawerNavigation';

function App(): React.JSX.Element {
  return (
    <View style={sty.AppContainer}>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </View>
  );
}

export default App