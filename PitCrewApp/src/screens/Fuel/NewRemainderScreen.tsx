import { View, Text, StatusBar, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { Appbar } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'
import { Icon } from '@rneui/base'
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import firebase from 'firebase/compat/app'
import { serverTimestamp } from 'firebase/firestore'
import { showMessage } from 'react-native-flash-message'
import * as CalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';


const NewRemainderScreen = (props: any) => {

    const stack = props.navigation;

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const dropdownCatItems = [
        { label: 'Fuel', value: 'Fuel' },
        { label: 'Insurance', value: 'Insurance' },
        { label: 'Maintenance', value: 'Maintenance' }
    ];


    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        setShow(false);
    }

    const showDatePicker = () => {
        setShow(true);
    }

    const onSavePress = async () => {
        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        const uid = await AsyncStorage.getItem('USERID');

        if (uid) {
            const remindersRef = firebase.firestore().collection('RemainderRecords').doc();
            remindersRef.set({
                UserId: uid,
                Category: selectedCategory,
                RemindDate: formattedDate,
                Note: note,
                CreatedAt: serverTimestamp()
            }).then(() => {
                console.log('Record added');
                stack.navigate('Remainders');
                AddEventToCalendar(date);
                showMessage({
                    message: "Record added.",
                    type: 'success',
                })
            });
        }
    }

    const utcDateToString = (momentInUTC: any) => {
        let reminderDate = moment
        .utc(momentInUTC)
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        return reminderDate;
    }

    const AddEventToCalendar = (startDateUTC: any) => {
        const eventConfig = {
            title: selectedCategory,
            startDate: utcDateToString(startDateUTC),
            endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
            notes: note,
        }
        CalendarEvent.presentEventCreatingDialog(eventConfig)
        .then(eventInfo => {
            Alert.alert('Event added', JSON.stringify(eventInfo));
            console.log(JSON.stringify(eventInfo));
        })
        .catch(error =>{
            Alert.alert('Failed', error);
        })
    }

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: '#F4F4F4' }} >

                <Appbar.Header style={{ backgroundColor: 'white' }}>
                    <Appbar.Content title='Cancel' onPress={() => { stack.navigate('Remainders') }} titleStyle={{ fontSize: 20 }} color='#616161' style={{ alignItems: 'flex-start' }} />
                    <Appbar.Content title='Remainder' titleStyle={{ fontSize: 20 }} color='#0B0B0B' style={{ alignItems: 'center' }} />
                    <Appbar.Content title='Save' onPress={onSavePress} titleStyle={{ fontSize: 20 }} color='#1691F7' style={{ alignItems: 'flex-end', marginRight: 10 }} />
                </Appbar.Header>

                <StatusBar backgroundColor={'#291D7D'} />

                <Image source={require('../../../assets/img/Fuel/newRemainderPic.jpg')} style={{ height: '30%', width: '90%', marginTop: '10%', alignSelf: 'center' }} />

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%', marginTop: '10%' }}>
                    <View style={[styles.recordPic, { backgroundColor: '#FFEE96' }]}>
                        <Image source={require('../../../assets/img/Fuel/category.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 15, justifyContent: 'center' }}>
                        <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Category</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Dropdown
                            style={{ width: 130, height: 50, marginLeft: '5%' }}
                            itemTextStyle={{color: 'black'}}
                            selectedTextStyle={{ color: '#67676D' }}
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
                        <Image source={require('../../../assets/img/Fuel/remaind.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 15, justifyContent: 'center' }}>
                        <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Remaind me in</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={showDatePicker} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text> {date.toLocaleDateString()} </Text>
                            <Icon name='right' type='antdesign' size={10} />
                        </TouchableOpacity>
                        {show && (
                            <DateTimePicker testID='dateTimePicker' value={date} mode='date' onChange={onChange} />
                        )}
                    </View>
                </View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                    <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                        <Image source={require('../../../assets/img/Fuel/note.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                        <TextInput placeholder='Note ' onChangeText={(text) => setNote(text)}  placeholderTextColor={'#D2D2D2'} style={{ fontFamily: 'Poppins-Medium', fontSize: 17, color: '#67676D' }} />
                    </View>
                </View>

            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    recordPic: {
        height: 40,
        width: 40,
        borderRadius: 100,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
    }
})


export default NewRemainderScreen

function utcDateToString(formattedDate: string) {
    throw new Error('Function not implemented.')
}
