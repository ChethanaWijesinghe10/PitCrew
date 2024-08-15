import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { sty } from '../styles/Styles'
import { HeaderSignUp } from './SignUpUser'
import { Button } from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Dropdown } from 'react-native-element-dropdown'
import firebase from 'firebase/compat/app'
import { useNavigation } from '@react-navigation/native'

const SignUpMechanic = (Props: any) => {

    const stack = Props.navigation;

    function gotoSignIn() {
        stack.navigate('SignIn');
    }

    return (
        <View style={sty.AppContainer}>

            <HeaderSignUp hs_stack={stack} />

            <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>

                <Text style={{
                    marginLeft: '8%',
                    marginTop: '6%',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 28, color: '#02010B'
                }}>
                    Hi, Mechanics
                </Text>
                <Text style={{
                    marginLeft: '8%',
                    fontFamily: 'Poppins-Regular',
                    color: '#02010B'
                }}>
                    {'As mechanics please fill below information \nand complete your profile'}
                </Text>

                <SignUpSection ss_stack={stack} />

                <Text style={{ alignSelf: 'center', marginTop: '10%', marginBottom: '10%', color: 'black' }}>
                    Existing user?
                    <Text style={{ color: '#291D7D', fontWeight: '900' }} onPress={gotoSignIn}> Sign In </Text>here
                </Text>
            </KeyboardAwareScrollView>
        </View>
    )
}


function SignUpSection(p: any) {

    const nav: any = useNavigation();

    const dropdownItems = [
        { label: 'Auto Mechanic', value: 'Auto Mechanic' },
        { label: 'Air Conditioning Technician', value: 'Air Conditioning Technician' },
        { label: 'Auto Body', value: 'Auto Body' },
        { label: 'Auto Electrician', value: 'Auto Electrician' },
        { label: 'Heavy Vehicle Mechanic', value: 'Heavy Vehicle Mechanic' },
        { label: 'Tire Mechanic', value: 'Tire Mechanic' },
    ];

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [nic, setNic] = useState('');
    const [workshopName, setWorkshopName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [address, setAddress] = useState('');
    const [workingCity, setWorkingCity] = useState('');
    const [specificArea, setSpecificArea] = useState('');

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
                    contactNo,
                    nic,
                    workshopName,
                    ownerName,
                    address,
                    workingCity,
                    specificArea,

                };

                const usersRef = firebase.firestore().collection('Mechanics').doc(uid) 
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
    }


    return (
        <View>
            <View style={{ marginTop: '6%' }}>
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
                    keyboardType='numeric' 
                    maxLength={10} 
                    onChangeText={(text) => setContactNo(text)} 
                    placeholder='Contact No' 
                    placeholderTextColor={'#B3B3B6'} 
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={sty.TextInputField}>
                    <TextInput 
                    onChangeText={(text) => setNic(text)} 
                    placeholder='NIC' 
                    placeholderTextColor={'#B3B3B6'} 
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={sty.TextInputField}>
                    <TextInput 
                    onChangeText={(text) => setWorkshopName(text)} 
                    placeholder='Workshop Name' 
                    placeholderTextColor={'#B3B3B6'}
                    autoCapitalize='sentences' 
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={sty.TextInputField}>
                    <TextInput 
                    onChangeText={(text) => setOwnerName(text)} 
                    placeholder="Owner's Name" 
                    placeholderTextColor={'#B3B3B6'}
                    autoCapitalize='sentences' 
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={sty.TextInputField}>
                    <TextInput 
                    multiline 
                    onChangeText={(text) => setAddress(text)} 
                    placeholder='Address' 
                    placeholderTextColor={'#B3B3B6'} 
                    autoCapitalize='sentences'
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={sty.TextInputField}>
                    <TextInput 
                    onChangeText={(text) => setWorkingCity(text)} 
                    placeholder='Working City' 
                    placeholderTextColor={'#B3B3B6'} 
                    autoCapitalize='sentences'
                    style={{ marginHorizontal: '5%', color: 'black' }} />
                </View>
                <View style={[sty.TextInputField, { marginTop: '5%' }]}>
                    <Dropdown
                        style={{ width: 310, height: 50, marginLeft: '5%', }}
                        selectedTextStyle={{ color: 'black' }}
                        placeholderStyle={{ color: '#B3B3B6' }}
                        itemTextStyle={{ color: 'black' }}
                        data={dropdownItems}
                        onChange={(item) => setSpecificArea(item.value)}
                        value={specificArea}
                        placeholder="Specialized Area"
                        labelField={'label'}
                        valueField={'value'}
                    />
                </View>
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
                    marginTop: '15%',
                }}

            >
                <Text style={{ fontSize: 18 }}>Register</Text>
            </Button>
        </View>

    );
}



export default SignUpMechanic