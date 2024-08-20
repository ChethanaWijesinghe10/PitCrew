import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import SparePartsNavigator from './SparePartsNavigator';
import UserProfileNavigation from './UserProfileNavigation';
import WorkshopList from '../screens/WorkshopList';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: styles.tabBar }}  >
                <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon: ({focused}) => (
                    <View style={styles.iconContainer} >
                        <Icon name='home' type='material' size={35} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={[styles.iconText, {color: focused? '#ED1C24' : '#707477'},]}>Home</Text>
                    </View>
                )}}/>
                <Tab.Screen name="Spare Parts" component={SparePartsNavigator} options={{tabBarIcon: ({focused}) => (
                   <View style={styles.iconContainer} >
                        <Icon name='settings' type='material' size={32} style={{marginTop: '1%'}} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={[styles.iconText, {color: focused? '#ED1C24' : '#707477'},]}>Parts</Text>
                    </View>
                )}} />
                <Tab.Screen name="Request" component={HomeScreen} options={{tabBarIcon: ({focused}) => (
                    <View style={styles.iconContainer} >
                        <Icon name='plus-circle' type='material-community' size={35} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={[styles.iconText, {color: focused? '#ED1C24' : '#707477'},]}>Request</Text>
                    </View>
                )}} />
                <Tab.Screen name="Workshops" component={WorkshopList} options={{tabBarIcon: ({focused}) => (
                    <View style={styles.iconContainer} >
                        <Image style={{width: 35, height: 35,}} source={focused? require('../../assets/img/Icons/workshopActive.png') : require('../../assets/img/Icons/workshop.png')} />
                        <Text style={[styles.iconText, {color: focused? '#ED1C24' : '#707477'},]}>Workshop</Text>
                    </View>
                )}} />
                <Tab.Screen name="Profile" component={UserProfileNavigation} options={{tabBarIcon: ({focused}) => (
                    <View style={styles.iconContainer} >
                        <Icon name='person-circle' type='ionicon' size={35} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={[styles.iconText, {color: focused? '#ED1C24' : '#707477'},]}>Profile</Text>
                    </View>
                )}} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        height: 70,
        paddingHorizontal: 5
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    iconText: {
        fontFamily: 'Poppins-Medium',
        marginTop: 3,
        textAlign: 'center'
    }
})

export default TabNavigation