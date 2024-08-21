import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from '../navigations/TabNavigation';
import CustomDrawer from './CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons'
import TabNavigationMechanic from './TabNavigationMechanic';
import { Icon } from '@rneui/base';
import FuelNavigator from './FuelNavigator';
import ContactUsScreen from '../screens/ContactUsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigationMechanic = (props: any) => {

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator 
      screenOptions={{
        drawerActiveTintColor: 'white', 
        drawerInactiveTintColor: 'white', 
        headerTintColor: 'white', 
        headerStyle: {backgroundColor: '#11046E'}
      }} 
      drawerContent={(props) => <CustomDrawer {...props} navigation={props.navigation} />
      }>
        <Drawer.Screen name="Home" component={TabNavigationMechanic} 
        options={{ 
          headerTitle: 'PitCrew',
          headerTitleAlign:'center', 
          headerTitleStyle: {fontSize: 25 }, 
          drawerItemStyle: {marginTop: 20}, 
          drawerIcon: ({color}) => {
          return <Ionicons name="home-outline" size={22} color={color} style={{marginLeft: 5}} />;
        }, }}/>
        <Drawer.Screen name="Maintenance Records" component={FuelNavigator} 
        options={{ 
          headerTitle: 'Maintenance Records',
          headerTitleAlign:'center', 
          headerTitleStyle: {fontSize: 23 }, 
          drawerItemStyle: {marginTop: 20}, 
          drawerIcon: ({color}) => {
          return <Icon name="gas-station" type='material-community' size={22} color={color} style={{marginLeft: 5}} />;
        }, }}/>
        <Drawer.Screen name="Contact Us" component={ContactUsScreen} 
        options={{ 
          headerTitle: 'Contact Us',
          headerTitleAlign:'center', 
          headerTitleStyle: {fontSize: 23 }, 
          drawerItemStyle: {marginTop: 20}, 
          drawerIcon: ({color}) => {
          return <Icon name="message" type='material' size={22} color={color} style={{marginLeft: 5}} />;
        }, }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}


export default DrawerNavigationMechanic