import { View, Text } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import AppNavigation from './src/navigations/AppNavigation';
import { sty } from './src/styles/Styles';
import { NavigationContainer } from '@react-navigation/native';

import DrawerNavigation from './src/navigations/DrawerNavigation';
import WorkshopProfile from './src/screens/Profile/EditWorkshopProfile';

import WorkshopProfile1 from './src/screens/Profile/WorkshopProfile';
import WorkshopNavigation from './src/navigations/WorkshopNavigation';
import UserProfile1 from './src/screens/UserProfile1';
import UserProfile2 from './src/screens/UserProfile2';
import UserNavigation from './src/navigations/UserNavigation';
import WorkshopList from './src/screens/WorkshopList';

import ChatBotScreen from './src/screens/ChatBotScreen';

import { UserTypeProvider } from './src/components/UserTypeContext';
import FlashMessage from 'react-native-flash-message';


function App(): React.JSX.Element {
  return (

    <View style={sty.AppContainer}>
      <NavigationContainer>
        <UserTypeProvider>
          {/* <AppNavigation /> */}
         <WorkshopList/>
        </UserTypeProvider>
      </NavigationContainer>
      <FlashMessage position="bottom" />

    </View>   

    
  );
}

export default App