import { View, Text, Image, TouchableOpacity, Alert, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import SigninScreen from '../screens/SigninScreen'
import { firebase } from '../../firebase/firebaseConfig'
import '@react-native-firebase/auth';

const CustomDrawer = (props: any) => {

    const navigation: any = useNavigation();

    const [user, setUser] = useState<firebase.User | null>(null);


    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    const handleSignOut = () => {
        Alert.alert(
            "Confirm Sign Out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Sign out cancelled"),
                    style: "cancel"
                },
                {
                    text: "Sign Out",
                    onPress: () => {
                        // Implement your sign-out logic here
                        if (user) {
                            firebase.auth().signOut();
                            BackHandler.exitApp();

                        } else {
                            console.log('No user is logged in');
                        }
                        
                        console.log("User signed out");
                        // You can navigate to a sign-in screen or reset navigation stack
                    }
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#11046E' }}>
                <Image source={require('../../assets/img/logo.png')} style={{ width: 120, height: 120, margin: 20 }} />
                <View style={{ backgroundColor: 'black' }} >
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity onPress={handleSignOut} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="log-out-outline" size={22} color={'white'} />
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Roboto-Medium',
                                marginLeft: 25,
                                color: 'white'
                            }}>
                            Sign Out
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomDrawer