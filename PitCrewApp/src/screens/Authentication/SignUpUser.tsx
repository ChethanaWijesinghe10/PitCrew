import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { sty } from '../../styles/Styles'
import { Appbar, Button } from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import '@react-native-firebase/auth';
import { firebase } from '../../../firebase/firebaseConfig'
import { useNavigation } from '@react-navigation/native'
import { Icon } from '@rneui/base'


const SignUpUser = (props: any) => {

    const stack = props.navigation;

    return (
        <View style={sty.AppContainer}>
            <HeaderSignUp hs_stack={stack} />
            <Text style={{ marginTop: '7.5%', marginLeft: '8%', color: '#02010B', marginBottom: '5%', }}>
                Enter your details to register
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
    const [nic, setNic] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [hidePass, setHidePass] = useState(true);
    const [hideConPass, setHideConPass] = useState(true);

    const onPressRegister = async (p: any) => {


        if (password !== confirmPassword) {
            Alert.alert('Warning!', 'Passwords do not match.')
            return;
        }
        if (email && password && confirmPassword && name && nic && contactNo) {
            try {
                const response = await firebase.auth().createUserWithEmailAndPassword(email, password);

                if (response.user) {
                    const uid = response.user.uid;
                    const data = {
                        id: uid,
                        email,
                        name,
                        nic,
                        contactNo,
                    };

                    const usersRef = firebase.firestore().collection('VehicleOwners').doc(uid);
                    await usersRef.set(data);

                    await firebase.auth().currentUser?.sendEmailVerification();
                    Alert.alert("Success", "User created successfully! \nPlease verify your email address to proceed.");
                    nav.navigate('SignIn');
                } else {
                    console.error('User object not available in response');
                    Alert.alert('Error', 'An unexpected error occurred during registration.')
                }
            } catch (error: any) {
                console.log(error);
                Alert.alert('Error', error.message);
            }
        } else {
            Alert.alert('Error', 'Enter all details');
        }
    }

    return (
        <View style={sty.AppContainer}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'never'} >
                <View style={[sty.TextInputField, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
                    <Icon
                        name={'user'}
                        type='simple-line-icon'
                        size={18}
                        style={{ marginHorizontal: '5%' }}
                    />
                    <TextInput
                        onChangeText={(text) => setName(text)}
                        placeholder='Name'
                        placeholderTextColor={'#B3B3B6'}
                        autoCapitalize='sentences'
                        style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={[sty.TextInputField, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
                    <Icon
                        name={'mail-outline'}
                        type='ionicon'
                        size={18}
                        style={{ marginHorizontal: '5%' }}
                    />
                    <TextInput
                        onChangeText={(text) => setEmail(text)}
                        placeholder='Email Address'
                        placeholderTextColor={'#B3B3B6'}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={[sty.TextInputField, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Icon
                        name={'lock'}
                        type='simple-line-icon'
                        size={18}
                        style={{ marginHorizontal: '5%' }}
                    />
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        placeholder='Password'
                        placeholderTextColor={'#B3B3B6'}
                        secureTextEntry={hidePass}
                        style={{ flex: 1, marginHorizontal: '5%', color: 'black' }}
                    />
                    <Icon
                        name={hidePass ? 'eye-slash' : 'eye'}
                        type='font-awesome-5'
                        size={18}
                        onPress={() => setHidePass(!hidePass)}
                        style={{ marginRight: '8%' }}
                    />
                </View>
                <View style={[sty.TextInputField, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Icon
                        name={'lock'}
                        type='simple-line-icon'
                        size={18}
                        style={{ marginHorizontal: '5%' }}
                    />
                    <TextInput
                        onChangeText={(text) => setConfirmPassword(text)}
                        placeholder='Confirm Password'
                        placeholderTextColor={'#B3B3B6'}
                        secureTextEntry={hideConPass}
                        style={{ flex: 1, marginHorizontal: '5%', color: 'black' }}
                    />
                    <Icon
                        name={hideConPass ? 'eye-slash' : 'eye'}
                        type='font-awesome-5'
                        size={18}
                        onPress={() => setHideConPass(!hideConPass)}
                        style={{ marginRight: '8%' }}
                    />
                </View>
                <View style={[sty.TextInputField, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
                    <Icon
                        name={'idcard'}
                        type='antdesign'
                        size={18}
                        style={{ marginHorizontal: '5%' }}
                    />
                    <TextInput
                        onChangeText={(text) => setNic(text)}
                        placeholder='NIC'
                        placeholderTextColor={'#B3B3B6'}
                        style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={[sty.TextInputField, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]}>
                    <Icon
                        name={'contacts'}
                        type='antdesign'
                        size={18}
                        style={{ marginHorizontal: '5%' }}
                    />
                    <TextInput
                        onChangeText={(text) => setContactNo(text)}
                        placeholder='Contact No'
                        placeholderTextColor={'#B3B3B6'}
                        keyboardType='numeric'
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


export default SignUpUser