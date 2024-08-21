import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SigninScreen from '../screens/SigninScreen';
import SignupWelcomeScreen from '../screens/SignupWelcomeScreen';
import SignUpUser from '../screens/SignUpUser';
import SignUpMechanic from '../screens/SignUpMechanic';
import DrawerNavigation from './DrawerNavigation';
import DrawerNavigationMechanic from './DrawerNavigationMechanic';
import SignUpAdmin from '../screens/SignUpAdmin';
import DrawerNavigationAdmin from './DrawerNavigationAdmin';
import TabNavigationAdmin from './TabNavigationAdmin';


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