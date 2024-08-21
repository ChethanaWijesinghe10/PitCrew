import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import NewReportScreen from '../../screens/Fuel/NewReportScreen';
import FuelHome from '../../screens/Fuel/FuelHome';
import FuelLastEvents from '../../screens/Fuel/FuelLastEvents';
import ReminderListScreen from '../../screens/Fuel/RemainderListScreen';
import NewRemainderScreen from '../../screens/Fuel/NewRemainderScreen';
import ViewRemainderScreen from '../../screens/Fuel/ViewRemainderScreen';
import EditRecordScreen from '../../screens/Fuel/EditRecordScreen';
import ViewRecordScreen from '../../screens/Fuel/ViewRecordScreen';
import EditRemainderScreen from '../../screens/Fuel/EditRemainderScreen';

const FuelNavigator = () => {

    const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='FuelHome' component={FuelHome} />
        <Stack.Screen name='NewReport' component={NewReportScreen}/>
        <Stack.Screen name='LastEvents' component={FuelLastEvents}/>
        <Stack.Screen name='ViewRecord' component={ViewRecordScreen}/>
        <Stack.Screen name='Remainders' component={ReminderListScreen}/>
        <Stack.Screen name='NewRemainder' component={NewRemainderScreen}/>
        <Stack.Screen name='ViewRemainder' component={ViewRemainderScreen} />
        <Stack.Screen name='EditRecord' component={EditRecordScreen} />
        <Stack.Screen name='EditRemainder' component={EditRemainderScreen} />
    </Stack.Navigator>
  )
}

export default FuelNavigator