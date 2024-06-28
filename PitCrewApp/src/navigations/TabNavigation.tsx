import { View, Text, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import WorkshopList from '../screens/WorkshopList';


const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle:{height: 70} }}  >
                <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center'}} >
                        <Icon name='home' type='material' size={35} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={{color: focused? '#ED1C24' : '#707477', fontFamily: 'Poppins-Medium'}}>Home</Text>
                    </View>
                )}}/>
                <Tab.Screen name="Spare Parts" component={HomeScreen} options={{tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center'}} >
                        <Icon name='settings' type='material' size={32} style={{marginTop: '1%'}} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={{color: focused? '#ED1C24' : '#707477', fontFamily: 'Poppins-Medium', marginTop: 3}}>Parts</Text>
                    </View>
                )}} />
                <Tab.Screen name="Request" component={HomeScreen} options={{tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center'}} >
                        <Icon name='pluscircle' type='antdesign' size={30} color={focused? '#ED1C24' : '#707477'} />
                        <Text style={{color: focused? '#ED1C24' : '#707477', fontFamily: 'Poppins-Medium', paddingTop: 5}}>Request</Text>
                    </View>
                )}} />
                <Tab.Screen name="Workshops" component={HomeScreen} options={{tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', marginLeft: '5%'}} >
                        <Image style={{width: 38, height: 38,}} source={focused? require('../../assets/img/Icons/workshopActive.png') : require('../../assets/img/Icons/workshop.png')} />
                        <Text style={{color: focused? '#ED1C24' : '#707477', fontFamily: 'Poppins-Medium'}}>Workshop</Text>
                    </View>
                )}} />
                <Tab.Screen name="Chats" component={HomeScreen} options={{tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center'}} >
                        <Image style={{width: 35, height: 35, marginBottom: '2%'}} source={focused? require('../../assets/img/Icons/chatsActive.png') : require('../../assets/img/Icons/chats.png')} />
                        <Text style={{color: focused? '#ED1C24' : '#707477', fontFamily: 'Poppins-Medium'}}>Chats</Text>
                    </View>
                )}} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default TabNavigation