import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserProfile: React.FC = () => {
    const navigation = useNavigation();

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [ContactNo, setContactNo] = useState('');
    const [nic, setNic] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const userId = await AsyncStorage.getItem('USERID');
            console.log(userId);
            try {
                if (userId) {
                    const user = await firebase.firestore().collection('VehicleOwners').doc(userId).get();

                    if (user.exists) {
                        const data = user.data();
                        if (data) {
                            setUserName(data.name || '');
                            setEmail(data.email || '');
                            setContactNo(data.contactNo || '');
                            setNic(data.nic || '');
                        }
                    } else {
                        console.log('No such document!');
                    }
                }
            } catch (error) {
                console.error('Error fetching document: ', error);
            }
        };

        fetchData();
    }, []);

    return (
        <SafeAreaView>
            <View style={styles.Container}>
                {/* <View style={{ width: '100%', height: 60, backgroundColor: '#11046E', flexDirection: 'row' }}>
          <TouchableOpacity>
            <Icon style={{ marginLeft: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 }} name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{
            flex: 1,
            textAlign: 'center',
            color: '#fff',
            fontSize: 25,
            fontWeight: 'bold',
            marginTop: 15
          }}>Workshop Profile</Text>
        </View> */}
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} >
                    <View style={{ marginTop: 40 }}>
                        <Image source={require('../../../assets/img/logo.png')} style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            alignSelf: 'center',
                            marginBottom: 20,
                        }} />
                        <View style={styles.form}>
                            <Text style={styles.label}>Name: </Text>
                            <TextInput
                                style={styles.input}
                                value={userName}
                                editable={false}
                            />
                            <Text style={styles.label}>Email Address: </Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                editable={false}
                            />
                            <Text style={styles.label}>Contact No: </Text>
                            <TextInput
                                style={styles.input}
                                value={ContactNo}
                                editable={false}
                            />
                            <Text style={styles.label}>NIC: </Text>
                            <TextInput
                                style={styles.input}
                                value={nic}
                                editable={false}
                            />
                            <TouchableOpacity activeOpacity={0.5} onPress={()=> navigation.navigate('editUser' as never)} >
                                <View style={{
                                    backgroundColor: '#11046E',
                                    padding: 15,
                                    borderRadius: 10,
                                    marginTop: 20,
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                    }} >Edit</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    );
};

export default UserProfile;

const styles = StyleSheet.create({
    Container: {
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
        color: 'black'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginTop: 5,
        borderRadius: 5,
        color: 'black'
    },
    form: {
        padding: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
