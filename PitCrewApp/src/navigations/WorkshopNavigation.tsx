import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import WorkshopProfile1 from '../screens/WorkshopProfile1';
import WorkshopProfile from '../screens/WorkshopProfile';
import SaveScreen from '../screens/SaveScreen';

export default function WorkshopNavigation() {
    const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
  
    <Stack.Screen name="workshopscreen1" component={WorkshopProfile1} options={{ headerShown: false }} />
    <Stack.Screen name="workshopscreen2" component={WorkshopProfile} options={{ headerShown: false }} />
    <Stack.Screen name="workshopscreen3" component={SaveScreen} options={{ headerShown: false }} />
   
  
   
  </Stack.Navigator>
  )
}
