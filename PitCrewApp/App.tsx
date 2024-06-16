import { View, Text } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import AppNavigation from './src/navigations/AppNavigation';
import { sty } from './src/styles/Styles';
import { NavigationContainer } from '@react-navigation/native';
import { UserTypeProvider } from './src/components/UserTypeContext';
import FlashMessage from 'react-native-flash-message';

function App(): React.JSX.Element {
  return (
    <View style={sty.AppContainer}>
      <NavigationContainer>
        <UserTypeProvider>
          <AppNavigation />
        </UserTypeProvider>
      </NavigationContainer>
      <FlashMessage position="bottom" />
    </View>
  );
}

export default App