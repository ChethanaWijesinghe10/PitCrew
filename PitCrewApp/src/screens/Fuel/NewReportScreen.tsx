import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { sty } from '../../styles/Styles'
import { Appbar } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'
import { Icon } from '@rneui/base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native'
import { firebase } from '../../../firebase/firebaseConfig'
import '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { showMessage } from 'react-native-flash-message'
import { ScrollView } from 'react-native-gesture-handler'
import { serverTimestamp } from 'firebase/firestore'

const NewReportScreen = (props: any) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [price, setPrice] = useState('');
    const [odo, setOdo] = useState('');
    const [note, setNote] = useState('');
    const [priceLiter, setPriceLiter] = useState('');
    const [liters, setLiters] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [garageName, setGarageName] = useState('');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [user, setUser] = useState<firebase.User | null>(null);

    const stack = props.navigation;

    const dropdownCatItems = [
        { label: 'Fuel', value: 'Fuel' },
        { label: 'Service', value: 'Service' },
        { label: 'Insurance', value: 'Insurance' }
    ];

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


    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        console.log(currentDate);
        setShow(false);
    }

    const showDatePicker = () => {
        setShow(true);
    }

    const onSavePress = async (p: any) => {

        const navigation = p.navigation;

        let litersCalculated = '';
        if (selectedCategory === 'Fuel' && price && priceLiter) {
            litersCalculated = (parseFloat(price) / parseFloat(priceLiter)).toString();
            console.log(litersCalculated);
        }

        console.log(selectedCategory)

        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        const uid = await AsyncStorage.getItem('USERID');
        if (uid) {
            const maintenanceRef = firebase.firestore().collection('MaintenanceRecords').doc();
            if (selectedCategory === 'Fuel') {
                console.log(liters);
                maintenanceRef.set({
                    Category: selectedCategory,
                    Price: price,
                    UserId: uid,
                    Date: formattedDate,
                    Odometer: odo,
                    PricePLiter: priceLiter,
                    Liters: litersCalculated,
                    Note: note,
                    CreatedAt: serverTimestamp()
                }).then(() => {
                    console.log('Record added');
                    stack.navigate('LastEvents');
                    showMessage({
                        message: "Record added.",
                        type: 'success',
                    })
                });
            } if (selectedCategory === 'Service') {
                maintenanceRef.set({
                    Category: selectedCategory,
                    Price: price,
                    UserId: uid,
                    Date: formattedDate,
                    Odometer: odo,
                    ServiceType: serviceType,
                    GarageName: garageName,
                    Note: note,
                    CreatedAt: serverTimestamp()
                }).then(() => {
                    console.log('Record added');
                    stack.navigate('LastEvents');
                    showMessage({
                        message: "Record added.",
                        type: 'success',
                    })
                });
            } if (selectedCategory === 'Insurance') {
                maintenanceRef.set({
                    Category: selectedCategory,
                    Price: price,
                    UserId: uid,
                    Date: formattedDate,
                    Odometer: odo,
                    Note: note,
                    CreatedAt: serverTimestamp()
                }).then(() => {
                    console.log('Record added');
                    stack.navigate('LastEvents');
                    showMessage({
                        message: "Record added.",
                        type: 'success',
                    })
                });
            }
        } else {
            console.error('User ID not found in AsyncStorage');
        }


    }

    return (
        <SafeAreaProvider>
            <View style={[sty.AppContainer, { backgroundColor: '#F4F4F4' }]}>

                <Appbar.Header style={{ backgroundColor: 'white' }}>
                    <Appbar.BackAction color='black' onPress={() => { props.navigation.navigate('FuelHome') }} />
                    <Appbar.Content title='New Report' titleStyle={{ textAlign: 'center' }} color='black' />
                    <Appbar.Content title='Save' onPress={onSavePress} titleStyle={{ fontSize: 17 }} color='#1691F7' style={{ alignItems: 'flex-end', paddingRight: 10 }} />
                </Appbar.Header>
                <ScrollView>
                    <View style={{ marginTop: 0, height: 140, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput keyboardType='numeric' onChangeText={(text) => setPrice(text)} placeholder='0' placeholderTextColor={'black'} cursorColor={'#F4F4F4'} style={{ textAlign: 'center', fontSize: 80, color: 'black', fontFamily: 'Poppins-Regular', paddingRight: 10, borderWidth: 0 }} />
                        <Text style={{ fontSize: 30, color: 'black', fontFamily: 'Poppins-Regular', paddingRight: 5 }}> LKR </Text>
                    </View>

                    <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                        <View style={[styles.recordPic, { backgroundColor: '#FFEE96' }]}>
                            <Image source={require('../../../assets/img/Fuel/category.png')} style={{ width: 25, height: 25 }} />
                        </View>
                        <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                            <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Category</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Dropdown
                                style={{ width: 110, height: 50, marginLeft: '5%', }}
                                selectedTextStyle={{ color: 'black' }}
                                itemTextStyle={{color: '#67676D'}}
                                placeholderStyle={{ color: '#B3B3B6' }}
                                data={dropdownCatItems}
                                onChange={(item) => setSelectedCategory(item.value)}
                                value={selectedCategory}
                                placeholder="Select"
                                labelField={'label'}
                                valueField={'value'}
                                renderRightIcon={() => (<Icon name='right' type='antdesign' size={10} />)}
                            />
                        </View>
                    </View>

                    <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                        <View style={[styles.recordPic, { backgroundColor: '#8BE8BD' }]}>
                            <Image source={require('../../../assets/img/Fuel/day.png')} style={{ width: 25, height: 25 }} />
                        </View>
                        <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                            <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Day</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={showDatePicker} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text> {date.toLocaleDateString()} </Text>
                                <Icon name='right' type='antdesign' size={10} />
                            </TouchableOpacity>
                            {show && (
                                <DateTimePicker testID='dateTimePicker' value={date} mode='date' display='default' is24Hour={true} onChange={onChange} />
                            )}
                        </View>

                    </View>

                    <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                        <View style={[styles.recordPic, { backgroundColor: '#97F1EC' }]}>
                            <Image source={require('../../../assets/img/Fuel/odo.png')} style={{ width: 25, height: 25 }} />
                        </View>
                        <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                            <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Odometer</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TextInput keyboardType='numeric' onChangeText={(text) => setOdo(text)} placeholder='Enter Odo' />
                            <Icon name='right' type='antdesign' size={10} />
                        </View>
                    </View>

                    {
                        selectedCategory === 'Fuel' && (
                            <FuelOption setPriceLiter={setPriceLiter} setLiters={setLiters} liters={liters} />
                        )
                    }

                    {
                        selectedCategory === 'Service' && (
                            <ServiceOption setServiceType={setServiceType} setGarageName={setGarageName} />
                        )
                    }

                    <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                        <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                            <Image source={require('../../../assets/img/Fuel/note.png')} style={{ width: 25, height: 25 }} />
                        </View>
                        <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                            <TextInput placeholder='Note ' onChangeText={(text) => setNote(text)} placeholderTextColor={'#D2D2D2'} style={{ fontFamily: 'Poppins-Medium', fontSize: 17 }} />
                        </View>
                    </View>
                </ScrollView>

            </View>
        </SafeAreaProvider>
    )
}

function FuelOption({ setPriceLiter, setLiters, liters }: {
    setPriceLiter: React.Dispatch<React.SetStateAction<string>>,
    setLiters: React.Dispatch<React.SetStateAction<string>>,
    liters: string
}) {
    return (
        <View>
            <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                    <Image source={require('../../../assets/img/Fuel/pricel.png')} style={{ width: 25, height: 25 }} />
                </View>
                <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                    <TextInput keyboardType='numeric' onChangeText={(text) => setPriceLiter(text)} placeholder='Price/Liter' placeholderTextColor={'#D2D2D2'} style={{ width: '90%', fontFamily: 'Poppins-Medium', fontSize: 17 }} />
                </View>
            </View>
        </View>
    );
}

function ServiceOption({ setServiceType, setGarageName }: {
    setServiceType: React.Dispatch<React.SetStateAction<string>>,
    setGarageName: React.Dispatch<React.SetStateAction<string>>,
}) {
    return (
        <View>
            <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                    <Icon name='checklist' type='octicon' color={'#d6d6d6'} size={20} />
                </View>
                <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                    <TextInput placeholder='Service Type    ' onChangeText={(text) => setServiceType(text)} placeholderTextColor={'#D2D2D2'} style={{ fontFamily: 'Poppins-Medium', fontSize: 17, }} />
                </View>
            </View>

            <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                    <Icon name='garage' type='material-community' color={'#d6d6d6'} style={{ width: 30, height: 30 }} />
                </View>
                <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                    <TextInput placeholder='Garage Name     ' onChangeText={(text) => setGarageName(text)} placeholderTextColor={'#D2D2D2'} style={{ fontFamily: 'Poppins-Medium', fontSize: 17 }} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    recordPic: {
        height: 40,
        width: 40,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
    }
})

export default NewReportScreen