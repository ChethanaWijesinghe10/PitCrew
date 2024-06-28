import { View, Text, StatusBar, Image } from 'react-native'
import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native-paper';
import { sty } from '../styles/Styles';

const SplashScreen = (props: any) => {

    const stack = props.navigation;

    useEffect(() => {
        const timer = setTimeout(() => {
            stack.navigate('Welcome')
        }, 3000);
        return () => clearTimeout(timer);
    }, []);


    return (
        <View style={sty.SplashContainer} >
            <StatusBar backgroundColor={'#35343C'} />
            <Image source={require('../../assets/img/logo.png')} style={{ width: 150, height: 150 }} />
            <ActivityIndicator color='white' style={{ marginTop: '10%' }} />
        </View>
    )
}

export default SplashScreen