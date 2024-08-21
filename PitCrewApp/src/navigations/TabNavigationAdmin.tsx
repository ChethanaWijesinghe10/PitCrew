import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import WorkshopListAdmin from '../screens/WorshopListAdmin';
import UsersListAdmin from '../screens/UsersListAdmin';
import AdminProfileNavigation from './AdminProfileNavigation';
import HomeAdmin from '../screens/HomeAdmin';
import ItemsAdmin from '../screens/SpareParts/Admin/ItemsAdmin';


const Tab = createBottomTabNavigator();

const TabNavigationAdmin = () => {
    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: styles.tabBar }}  >
                <Tab.Screen name="Home" component={HomeAdmin} options={{tabBarIcon: ({focused}) => (
                    <View style={styles.iconContainer} >
                        <Icon name='home' type='material' size={35} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={[styles.iconText, {color: focused? '#ED1C24' : '#707477'},]}>Home</Text>
                    </View>
                )}}/>
                <Tab.Screen name="Spare Parts" component={ItemsAdmin} options={{tabBarIcon: ({focused}) => (
                   <View style={styles.iconContainer} >
                        <Icon name='settings' type='material' size={32} style={{marginTop: '1%'}} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={[styles.iconText, {color: focused? '#ED1C24' : '#707477'},]}>Parts</Text>
                    </View>
                )}} />
                <Tab.Screen name="Request" component={UsersListAdmin} options={{tabBarIcon: ({focused}) => (
                    <View style={styles.iconContainer} >
                        <Icon name='users' type='font-awesome' size={32} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={[styles.iconText, {color: focused? '#ED1C24' : '#707477'},]}>Users</Text>
                    </View>
                )}} />
                <Tab.Screen name="Workshops" component={WorkshopListAdmin} options={{tabBarIcon: ({focused}) => (
                    <View style={styles.iconContainer} >
                        <Image style={{width: 35, height: 35,}} source={focused? require('../../assets/img/Icons/workshopActive.png') : require('../../assets/img/Icons/workshop.png')} />
                        <Text style={[styles.iconText, {color: focused? '#ED1C24' : '#707477'},]}>Workshop</Text>
                    </View>
                )}} />
                <Tab.Screen name="Profile" component={AdminProfileNavigation} options={{tabBarIcon: ({focused}) => (
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

export default TabNavigationAdmin