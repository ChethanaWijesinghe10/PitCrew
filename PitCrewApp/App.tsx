import { View, Text } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import AppNavigation from './src/navigations/AppNavigation';
import { sty } from './src/styles/Styles';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './src/navigations/DrawerNavigation';
import WorkshopProfile from './src/screens/WorkshopProfile';

import WorkshopProfile1 from './src/screens/WorkshopProfile1';
import WorkshopNavigation from './src/navigations/WorkshopNavigation';
import UserProfile1 from './src/screens/UserProfile1';
import UserProfile2 from './src/screens/UserProfile2';
import UserNavigation from './src/navigations/UserNavigation';
import WorkshopList from './src/screens/WorkshopList';


function App(): React.JSX.Element {
  return (
    <View style={sty.AppContainer}>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </View>

    // <View style={sty.AppContainer}>
    //   <NavigationContainer>
    //    <WorkshopNavigation />
    //   </NavigationContainer>
    // </View>
    
    // <View style={sty.AppContainer}>
    //   <NavigationContainer>
    //  <UserNavigation />
    //   </NavigationContainer>
    // </View>
    // <WorkshopList/>

  

    

   
  );
}

export default App