import { View, Text, StatusBar, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { sty } from '../styles/Styles'
import { ActivityIndicator, Appbar, Button } from 'react-native-paper'
import { firebase, firebaseConfig } from '../../firebase/firebaseConfig'
import 'firebase/compat/auth';
import { useNavigation } from '@react-navigation/native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'; 
import auth from '@react-native-firebase/auth';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp } from 'firebase/app'
import { useUserType } from '../components/UserTypeContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SigninScreen = (props: any) => {

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '212460218817-6dudmms25hj5fco1th3goq9aeal4c78n.apps.googleusercontent.com',
        });
    }), []

    const stack = props.navigation;

    function gotoSignUp() {
        stack.navigate('SignUpWelcome');
    }
    async function onGoogleButtonPress() {

        try {

            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            const user = firebase.auth().currentUser;

            console.log(user);
            console.log(idToken)
            Alert.alert("Success")

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    const data = {
                        id: user.uid,
                        email: user.email,
                        name: user.displayName,
                    };

                    const usersRef = firebase.firestore().collection('VehicleOwners').doc(user.uid);
                    usersRef.set(data);

                    console.log('User data stored successfully!');

                } else {
                    console.log('No user is signed in');
                }
            });

            await GoogleSignin.revokeAccess(); // added now
            await auth().signOut();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);

        } catch (error: any) {
            console.log(error);
            Alert.alert(error.message);
        }
    }

    return (
        <View style={sty.AppContainer}>
            <StatusBar backgroundColor={'#fff'} />
            <Appbar.Header style={{ backgroundColor: 'white' }}>
                <Appbar.BackAction color='#584F9A' style={sty.BackIcon} onPress={() => { stack.navigate('Welcome') }} />
                <Text style={sty.BackWord}>Back</Text>
            </Appbar.Header>
            <Image source={require('../../assets/img/logoWhite.jpg')} style={{ alignSelf: 'center', width: 150, height: 150 }} />

            <SignInSection />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '7%' }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black', marginLeft: '15%' }} />
                <View>
                    <Text style={{ width: 60, textAlign: 'center', fontSize: 16 }}>or</Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black', marginRight: '15%' }} />
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={onGoogleButtonPress} >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: '#02010B',
                    backgroundColor: '#291D7D',
                    borderRadius: 10,
                    borderWidth: 1,
                    height: 60,
                    marginTop: '6%',
                    marginHorizontal: '8%'
                }}>
                    <Image source={require('../../assets/img/iconGoogle.png')} style={{ marginLeft: '15%' }} />
                    <Text style={{ marginLeft: '12%', fontSize: 16, color: 'white' }}>
                        Continue with Google
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={{ alignItems: 'center', marginTop: '6%' }}>
                <Text style={{ color: '#1B1A23', fontWeight: '400' }}>
                    Already have an account?
                </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={gotoSignUp}>
                    <Text style={{ color: '#291D7D', fontFamily: 'Poppins-Bold' }}>
                        Sign up here
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function SignInSection() {

    const nav: any = useNavigation();

    const { userType,setUserType } = useUserType(); 

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLogging, setIsLogging] = useState(false);

    useEffect(() => {
        console.log('User Type:', userType); // Log userType whenever it changes
    }, [userType]);

    function gotoHome() {
        setIsLogging(true);
        onLoginPress();
    }

    const onLoginPress = async () => {

        try {
            const response = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (response.user) {
                const uid = response.user.uid;

                const vehicleOwnerRef = firebase.firestore().collection('VehicleOwners').doc(uid);
                const mechanicRef = firebase.firestore().collection('Mechanics').doc(uid);
                const adminRef = firebase.firestore().collection('Admin').doc(uid);

                try {
                    const vehicleOwnerSnapshot = await vehicleOwnerRef.get();
                    const mechanicSnapshot = await mechanicRef.get();
                    const adminSnapshot = await adminRef.get();

                    if (vehicleOwnerSnapshot.exists) {
                        setIsLogging(false);
                        console.log('Navigate to User Home');
                        setUserType('VehicleOwner');
                        AsyncStorage.setItem('USERID', uid);
                        console.log(userType);
                        nav.navigate('HomeUser');

                        return;
                    } else if (mechanicSnapshot.exists) {
                        setIsLogging(false);
                        console.log('Navigate to Mechanic Home');
                        setUserType('Mechanic'); 
                        AsyncStorage.setItem('USERID', uid);
                        console.log(userType);
                        nav.navigate('HomeMec');
                        return;
                    } else if (adminSnapshot.exists) {
                        setIsLogging(false);
                        console.log('Navigate to Admin Home');
                        setUserType('Admin');
                        AsyncStorage.setItem('USERID', uid);
                        console.log(userType);
                        nav.navigate('HomeAdmin');
                    } else {
                        console.error('User not found in either collection');
                        Alert.alert('Error', 'User not found. Please contact support.');
                    }
                } catch (error) {
                    console.error(error);
                    Alert.alert('Error', 'An error occurred while checking user type.');
                }
            }
        } catch (error: any) {
            setIsLogging(false);
            console.log(error);
            Alert.alert(error.message || 'An error occurred during login.');
        }
    }

    const ForgotPassword = () => {

        initializeApp(firebaseConfig);

        if(email != null) {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent!');
            })
            .catch((error:  any) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert("Error", errorMessage)
                console.log(errorCode, errorMessage)
                // ..
            });
        } else {
            Alert.alert("Error", "Enter a valid email.");
        }
    }

    return (
        <View style={{marginTop: '10%'}}>
            <View style={[sty.TextInputField, { marginTop: '0%' }]}>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    autoCapitalize="none"
                    placeholder='Email Address'
                    placeholderTextColor={'#B3B3B6'}
                    style={{ marginHorizontal: '5%', color: 'black' }} />
            </View>
            <View style={sty.TextInputField}>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    autoCapitalize="none"
                    placeholder='Password'
                    placeholderTextColor={'#B3B3B6'}
                    secureTextEntry={true}
                    style={{ marginHorizontal: '5%', color: 'black' }} />
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={ForgotPassword} >
            <Text style={{ marginTop: '5%', marginLeft: '10%', textDecorationLine: 'underline', fontSize: 12, fontWeight: '800', color: '#1B1A23' }}>
                Forgot Password?
            </Text>
            </TouchableOpacity>
            <Button
                mode='contained'
                onPress={() => gotoHome()}
                style={{
                    borderRadius: 10,
                    backgroundColor: '#291D7D',
                    height: 55,
                    justifyContent: 'center',
                    marginHorizontal: '8%',
                    marginTop: '7.5%',
                }}>
                {
                    (isLogging) ? <ActivityIndicator color='white' />
                        :
                        <Text style={{ fontSize: 18 }}>Sign In</Text>
                }
            </Button>
        </View>
    );
}



export default SigninScreen