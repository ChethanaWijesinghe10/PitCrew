import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/Authentication/WelcomeScreen';
import SigninScreen from '../screens/Authentication/SigninScreen';
import SignupWelcomeScreen from '../screens/Authentication/SignupWelcomeScreen';
import SignUpUser from '../screens/Authentication/SignUpUser';
import SignUpMechanic from '../screens/Authentication/SignUpMechanic';
import SignUpAdmin from '../screens/Authentication/SignUpAdmin';
import TabNavigationAdmin from './Admin/TabNavigationAdmin';
import DrawerNavigation from './VehicleOwner/DrawerNavigation';
import DrawerNavigationMechanic from './Mechanic/DrawerNavigationMechanic';


const Stack = createStackNavigator();

const AppNavigation = () => {
    return (
        <NavigationContainer independent={true} >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="SignIn" component={SigninScreen} />
                <Stack.Screen name="SignUpWelcome" component={SignupWelcomeScreen} />
                <Stack.Screen name="SignUpUser" component={SignUpUser} />
                <Stack.Screen name="SignUpMec" component={SignUpMechanic} />
                <Stack.Screen name="SignUpAdmin" component={SignUpAdmin} />
                <Stack.Screen name="HomeUser" component={DrawerNavigation} />
                <Stack.Screen name="HomeMec" component={DrawerNavigationMechanic} />
                <Stack.Screen name="HomeAdmin" component={TabNavigationAdmin} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation