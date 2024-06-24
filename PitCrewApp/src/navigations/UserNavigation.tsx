import React from 'react'
import UserProfile1 from '../screens/UserProfile1';
import UserProfile2 from '../screens/UserProfile2';
import UserProfile3 from '../screens/UserProfile3';
import { createStackNavigator } from '@react-navigation/stack';

export default function UserNavigation() {
    const Stack = createStackNavigator();
  return (

    <Stack.Navigator>
  
    <Stack.Screen name="userscreen1" component={UserProfile1} options={{ headerShown: false }} />
    <Stack.Screen name="userscreen2" component={UserProfile2} options={{ headerShown: false }} />
    <Stack.Screen name="userscreen3" component={UserProfile3} options={{ headerShown: false }} />
   
  
   
  </Stack.Navigator>
  )
}
