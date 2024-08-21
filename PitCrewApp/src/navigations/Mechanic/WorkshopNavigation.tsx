import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import EditWorkshopProfile from '../../screens/Profile/EditWorkshopProfile';
import WorkshopProfile from '../../screens/Profile/WorkshopProfile';

export default function WorkshopProfileNavigation() {
    const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
  
    <Stack.Screen name="workshopscreen" component={WorkshopProfile} options={{ headerShown: false }} />
    <Stack.Screen name="EditWorksop" component={EditWorkshopProfile} options={{ headerShown: false }} />
   
  
   
  </Stack.Navigator>
  )
}
