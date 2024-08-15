import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import WorkshopList from '../screens/WorkshopList';
import WorkshopDetails from '../screens/WorkshopDetails';

export default function WorkshopNavigation() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator >
      <Stack.Screen name="WorkshopList" component={WorkshopList} options={{ headerShown: false }} />
      <Stack.Screen name="WorkshopDetails" component={WorkshopDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
