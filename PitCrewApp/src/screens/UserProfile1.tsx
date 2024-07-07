import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import WorkshopNavigation from '../navigations/WorkshopNavigation';

const WorkshopProfile1: React.FC = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [nic, setNIC] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace 'username' with the actual user's name or ID to fetch data
                const doc = await firebase.firestore().collection('Users').doc('Kalindu').get();
                if (doc.exists) {
                    const data = doc.data();
                    setName(data?.name ?? '');
                    setEmail(data?.email ?? '');
                    setMobile(data?.mobile ?? '');
                    setNIC(data?.nic ?? '');
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document: ', error);
            }
        };

        fetchData();
    }, []);

    const toggleSwitch = () => {
        setNotificationsEnabled(previousState => !previousState);
        Alert.alert(
            'Notification Status',
            `Notifications ${!notificationsEnabled ? 'Turn ON' : 'Turn OFF'}`
        );
    };

    return (
        <SafeAreaView>
            <View style={styles.Container}>
                <View style={styles.header}>
                    <TouchableOpacity>
                        <Icon style={styles.backIcon} name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Vehicle Owner Profile</Text>
                </View>
                <KeyboardAwareScrollView>
                    <View style={{ marginTop: 40 }}>
                        <Image source={require('../../assets/img/logo.png')} style={styles.logo} />
                        <View style={styles.form}>
                            <Text style={styles.label}> Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={name}
                                onChangeText={setName}
                                editable={false}
                            />
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                editable={false}
                            />
                            <Text style={styles.label}>Mobile</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mobile"
                                value={mobile}
                                onChangeText={setMobile}
                                editable={false}
                            />
                            <Text style={styles.label}>NIC</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="NIC"
                                value={nic}
                                onChangeText={setNIC}
                                editable={false}
                            />

                            <View style={styles.notificationBox}>
                                <Text style={styles.notificationTitle}>NOTIFICATION</Text>
                                <View style={styles.notificationToggle}>
                                    <Text style={styles.notificationText}>Turn ON/OFF notification</Text>
                                    <Switch
                                        onValueChange={toggleSwitch}
                                        value={notificationsEnabled}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('userscreen2')}>
                                <View style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    );
};

export default WorkshopProfile1;

const styles = StyleSheet.create({
    Container: {
        
        backgroundColor: 'white',
      
    },
    header: {
        width: '100%',
        height: 60,
        backgroundColor: '#11046E',
        flexDirection: 'row',
        alignItems: 'center'
    },
    backIcon: {
        marginLeft: 10,
        marginTop: 20,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 15
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    form: {
        padding: 20,
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
    notificationBox: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginTop: 30,
        alignItems: 'center'
    },
    notificationTitle: {
        fontWeight: 'bold',
        color: 'purple',
        marginBottom: 20,
        
    },
    notificationToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    notificationText: {
        color: 'black'
    },
    editButton: {
        backgroundColor: '#11046E',
        padding: 15,
        borderRadius: 10,
        marginTop: 30,
        alignItems: 'center',
        marginBottom: 150
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
