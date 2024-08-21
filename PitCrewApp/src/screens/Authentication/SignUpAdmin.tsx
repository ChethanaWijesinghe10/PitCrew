import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { sty } from '../../styles/Styles'
import { Appbar, Button } from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import '@react-native-firebase/auth';
import { firebase } from '../../../firebase/firebaseConfig'
import { useNavigation } from '@react-navigation/native'


const SignUpAdmin = (props: any) => {

    const stack = props.navigation;

    return (
        <View style={sty.AppContainer}>
            <HeaderSignUp hs_stack={stack} />
            <Text style={{ marginTop: '7.5%', marginLeft: '8%', color: '#02010B', marginBottom: '5%', }}>
                Enter admin details to register
            </Text>
            <SignUpSection ss_stack={stack} />
        </View>
    )
}

export function HeaderSignUp(p: any) {

    const stack = p.hs_stack;

    return (
        <View style={{ flexDirection: 'row' }}>
            <Appbar.Header style={{ backgroundColor: 'white' }}>
                <Appbar.BackAction color='#584F9A' style={sty.BackIcon} onPress={() => { stack.navigate('SignUpWelcome') }} />
                <Text style={sty.BackWord}>Back</Text>
                <Text style={sty.HeaderSignUp}>Sign Up</Text>
            </Appbar.Header>
        </View>
    );
}

function SignUpSection(p: any) {

    const nav: any = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const onPressRegister = async (p: any) => {


        if (password !== confirmPassword) {
            Alert.alert('Warning!', 'Passwords do not match.')
            return;
        }
        try {
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password);

            if (response.user) {
                const uid = response.user.uid;
                const data = {
                    id: uid,
                    email,
                    name
                };

                const usersRef = firebase.firestore().collection('Admin').doc(uid);
                await usersRef.set(data);

                // await firebase.auth().currentUser?.sendEmailVerification();
                Alert.alert("Success", "Admin created successfully! \nPlease verify your email address to proceed.");
                nav.navigate('SignIn');
            } else {
                console.error('User object not available in response');
                Alert.alert('Error', 'An unexpected error occurred during registration.')
            }
        } catch (error: any) {
            console.log(error);
            Alert.alert('Error', error.message);
        }
    }

    return (
        <View style={sty.AppContainer}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'never'} >
                <View style={sty.TextInputField}>
                    <TextInput 
                    onChangeText={(text) => setEmail(text)} 
                    placeholder='Email Address' 
                    placeholderTextColor={'#B3B3B6'} 
                    keyboardType='email-address'
                    autoCapitalize='none'
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={sty.TextInputField}>
                    <TextInput 
                    onChangeText={(text) => setPassword(text)} 
                    placeholder='Password' 
                    placeholderTextColor={'#B3B3B6'} 
                    secureTextEntry={true} 
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={sty.TextInputField}>
                    <TextInput 
                    onChangeText={(text) => setConfirmPassword(text)} 
                    placeholder='Confirm Password' 
                    placeholderTextColor={'#B3B3B6'} 
                    secureTextEntry={true} 
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={sty.TextInputField}>
                    <TextInput 
                    onChangeText={(text) => setName(text)} 
                    placeholder='Name' 
                    placeholderTextColor={'#B3B3B6'} 
                    autoCapitalize='sentences'
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>

                <Button
                    onPress={onPressRegister}
                    mode='contained'
                    style={{
                        borderRadius: 10,
                        backgroundColor: '#291D7D',
                        height: 55,
                        justifyContent: 'center',
                        marginHorizontal: '7.5%',
                        marginTop: '10%',
                    }}

                >
                    <Text style={{ fontSize: 18 }}>Register</Text>
                </Button>
            </KeyboardAwareScrollView>
        </View>
    )
}


export default SignUpAdmin