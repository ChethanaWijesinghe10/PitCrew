import { View, Text, StatusBar, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'
import { Icon } from '@rneui/base'
import DateTimePicker from '@react-native-community/datetimepicker';
import { DocumentData } from 'firebase/firestore'
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import firebase from 'firebase/compat/app'
import { showMessage } from 'react-native-flash-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

type RootStackParamList = {
    EditRemainderScreen: {
        id: string;
        data: {
            category: string;
            date: Date;
            note: string;
        };
    };
    Remainders: undefined;
    ViewRemainder: { id: string; data: DocumentData | null | undefined };
};

type EditItemRouteProp = RouteProp<RootStackParamList, 'EditRemainderScreen'>;

const EditRemainderScreen = (props: any) => {

    const route = useRoute<EditItemRouteProp>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { id, data } = route.params ?? { id: '', data: {} };
    const [recordDetails, setRecordDetails] = useState<DocumentData | null | undefined>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [note, setNote] = useState<string | undefined>(undefined);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const dropdownCatItems = [
        { label: 'Fuel', value: 'Fuel' },
        { label: 'Insurance', value: 'Insurance' },
        { label: 'Maintenance', value: 'Maintenance' }
    ];

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        console.log(currentDate);
        setShow(false);
    }

    const showDatePicker = () => {
        setShow(true);
    }

    useEffect(() => {
        const fetchRecordDetails = async () => {
            if (!id) {
                console.error('Record ID is empty or undefined.');
                setIsLoading(false);
                return;
            }

            try {
                const recordRef = firebase.firestore().collection('RemainderRecords').doc(id);
                const doc = await recordRef.get();
                console.log(id);
                if (doc.exists) {
                    const recordData = doc.data();
                    setRecordDetails(recordData);
                    setSelectedCategory(recordData?.Category);
                    setNote(recordData?.Note);
                    setDate(new Date(recordData?.RemindDate));
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching record details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecordDetails();
    }, [id]);

    const onSavePress = async () => {
        const formattedDate = date.toISOString().split('T')[0];
        const uid = await AsyncStorage.getItem('USERID');
        if (uid) {
            const maintenanceRef = firebase.firestore().collection('RemainderRecords').doc(id);
            maintenanceRef.update({
                Category: selectedCategory,
                RemindDate: formattedDate,
                Note: note,
            }).then(() => {
                console.log('Record updated');
                navigation.navigate('Remainders');
                showMessage({
                    message: "Record updated.",
                    type: 'success',
                })
            });
        }
        else {
            console.error('User ID not found in AsyncStorage');
        }
    };

    const onClosePress = () => {
        navigation.navigate('ViewRemainder', { id: id, data: recordDetails });
    }

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaProvider>
        );
    }

    if (!recordDetails) {
        return (
            <SafeAreaProvider>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No record found</Text>
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: '#F4F4F4' }} >

                <Appbar.Header style={{ backgroundColor: 'white' }}>
                    <Appbar.Content title='Cancel' onPress={onClosePress} titleStyle={{ fontSize: 20 }} color='#616161' style={{ alignItems: 'flex-start' }} />
                    <Appbar.Content title='Remainder' titleStyle={{ fontSize: 20 }} color='#0B0B0B' style={{ alignItems: 'center' }} />
                    <Appbar.Content title='Save' onPress={onSavePress} titleStyle={{ fontSize: 20 }} color='#1691F7' style={{ alignItems: 'flex-end', marginRight: 10 }} />
                </Appbar.Header>

                <StatusBar backgroundColor={'#291D7D'} />

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%', marginTop: '10%' }}>
                    <View style={[styles.recordPic, { backgroundColor: '#FFEE96' }]}>
                        <Image source={require('../../../assets/img/Fuel/category.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 15, justifyContent: 'center' }}>
                        <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Category</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Dropdown
                            style={{ width: 130, height: 50, marginLeft: '5%', }}
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

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: '5%', alignItems: 'center' }}>
                    <View style={[styles.recordPic, { backgroundColor: '#8BE8BD' }]}>
                        <Image source={require('../../../assets/img/Fuel/day.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                        <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Remind me on</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                        <TouchableOpacity onPress={showDatePicker}>
                            <Text style={{fontSize: 17, color: '#0B0B0B'}}> {recordDetails.RemindDate} </Text>
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
                        <TextInput placeholder='Note ' defaultValue={recordDetails.Note} onChangeText={setNote} placeholderTextColor={'#D2D2D2'} style={{ fontFamily: 'Poppins-Medium', fontSize: 17 }} />
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
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
    }
})



export default EditRemainderScreen