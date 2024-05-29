import { View, Text, Image } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'

const CustomDrawer = (props: any) => {
    return (
        <View style={{flex: 1, backgroundColor: 'black'}}>
            <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: '#11046E'}}>
                <Image source={require('../../assets/img/logo.png')} style={{width: 120, height: 120, margin: 20}} />
                <View style={{backgroundColor: 'black'}} >
                <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
        </View>
    )
}

export default CustomDrawer