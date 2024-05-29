import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { sty } from '../styles/Styles';

const WelcomeScreen = (props:any) => {

    const stack = props.navigation;
    
    useEffect(()=>{
        AsyncStorage.getItem('email').then((t: any) =>{
            console.log(t);
            if(t){
                stack.navigate('Home');
            }
        })
    },[])

  return (
    <LinearGradient
            colors={['#2108D4', '#7068a8', '#11046E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.7, y: 0.7 }}
            style={{ flex: 1 }}
        >
            <View style={sty.WelcomeContainer}>
                <StatusBar backgroundColor={'#472EFF'} />
                <Image style={{ alignSelf: 'center', marginTop: '8%' }} source={require('../../assets/img/welcomPic.png')} />
                <Text style={{ color: 'white', fontSize: 32, marginLeft: '7%', fontFamily: 'Poppins-Medium', fontWeight: '500', marginTop: '-5%' }}>WELCOME</Text>
                <Text style={{ color: 'white', fontSize: 20, marginLeft: '7%', fontFamily: 'Poppins-ExtraLight', fontWeight: '200', marginTop: '-3%' }}>Let's Get started</Text>

            </View>
            <View style={{ 
                backgroundColor: 'white', 
                flex: 1, marginTop: '60%', 
                borderTopLeftRadius: 40, 
                borderTopRightRadius: 40,
                justifyContent:'center', 
                alignItems:'center'
                }}>
                    <Buttons b_stack={stack}/>
            </View>
        </LinearGradient>
  )
}

function Buttons(p:any){

    const stack = p.b_stack;

    function gotoSignIn(){
        stack.navigate('SignIn');
    }
    
    function gotoSignUp(){
        stack.navigate('SignUpWelcome');
    }

    return (
        <View style={{flex: 1}}>
            <TouchableOpacity activeOpacity={0.7} onPress={gotoSignUp}>
            <View style={{marginTop: '45%' ,width: 160, height: 50, borderRadius: 25, backgroundColor: '#02010B', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 15, color: '#ffff'}}>Sign Up</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={gotoSignIn}>
            <View style={{borderColor: '#D5D6D8', borderWidth: 1 ,marginTop: '-50%' ,width: 160, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 15, color: '#02010B'}}>Sign In</Text>
            </View>
            </TouchableOpacity>
        </View>
    );
}

export default WelcomeScreen