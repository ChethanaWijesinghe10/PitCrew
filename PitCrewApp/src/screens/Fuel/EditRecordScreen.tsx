import { View, Text, Image, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { sty } from '../../styles/Styles';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import { Icon } from '@rneui/base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app';
import { showMessage } from 'react-native-flash-message';
import { DocumentData } from 'firebase/firestore';

type RootStackParamList = {
    EditRecordScreen: {
        id: string;
        data: {
            category: string;
            price: string;
            date: Date;
            odo: string;
            priceLiter: string;
            liters: string;
            serviceType: string;
            garageName: string;
            note: string;
        };
    };
    LastEvents: undefined;
    ViewRecord: { id: string; data: DocumentData | null | undefined };
};

type EditItemRouteProp = RouteProp<RootStackParamList, 'EditRecordScreen'>;

interface FuelOptionProps {
    priceLiter: string | undefined;
    setPriceLiter: React.Dispatch<React.SetStateAction<string | undefined>>;
    liters: string | undefined;
    setLiters: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface ServiceOptionProps {
    serviceType: string | undefined;
    setServiceType: React.Dispatch<React.SetStateAction<string | undefined>>;
    garageName: string | undefined;
    setGarageName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const EditRecordScreen = (props: any) => {
    const route = useRoute<EditItemRouteProp>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { id, data } = route.params ?? { id: '', data: {} };
    const [recordDetails, setRecordDetails] = useState<DocumentData | null | undefined>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [price, setPrice] = useState<string | undefined>(undefined);
    const [priceLiter, setPriceLiter] = useState<string | undefined>(undefined);
    const [odo, setOdo] = useState<string | undefined>(undefined);
    const [liters, setLiters] = useState<string | undefined>(undefined);
    const [serviceType, setServiceType] = useState<string | undefined>(undefined);
    const [garageName, setGarageName] = useState<string | undefined>(undefined);
    const [note, setNote] = useState<string | undefined>(undefined);
    const [date, setDate] = useState<Date>(new Date());

    const [show, setShow] = useState(false);

    const dropdownCatItems = [
        { label: 'Fuel', value: 'Fuel' },
        { label: 'Service', value: 'Service' },
        { label: 'Insurance', value: 'Insurance' }
    ];

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        setShow(false);
    };

    const showDatePicker = () => {
        setShow(true);
    };

    useEffect(() => {
        const fetchRecordDetails = async () => {
            if (!id) {
                console.error('Record ID is empty or undefined.');
                setIsLoading(false);
                return;
            }

            try {
                const recordRef = firebase.firestore().collection('MaintenanceRecords').doc(id);
                const doc = await recordRef.get();
                console.log(id);
                if (doc.exists) {
                    const recordData = doc.data();
                    setRecordDetails(recordData);
                    setSelectedCategory(recordData?.Category);
                    setPrice(recordData?.Price);
                    setPriceLiter(recordData?.PricePLiter);
                    setOdo(recordData?.Odometer);
                    setLiters(recordData?.Liters);
                    setServiceType(recordData?.ServiceType);
                    setGarageName(recordData?.GarageName);
                    setNote(recordData?.Note);
                    setDate(new Date(recordData?.Date));
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
            const maintenanceRef = firebase.firestore().collection('MaintenanceRecords').doc(id);
            if (selectedCategory === 'Fuel') {
                maintenanceRef.update({
                    Category: selectedCategory,
                    Price: price,
                    Date: formattedDate,
                    Odometer: odo,
                    PricePLiter: priceLiter,
                    Liters: liters,
                    Note: note,
                }).then(() => {
                    console.log('Record updated');
                    navigation.navigate('LastEvents');
                    showMessage({
                        message: "Record updated.",
                        type: 'success',
                    })
                });
            } if (selectedCategory === 'Service') {
                maintenanceRef.update({
                    Category: selectedCategory,
                    Price: price,
                    Date: formattedDate,
                    Odometer: odo,
                    ServiceType: serviceType,
                    GarageName: garageName,
                    Note: note,
                }).then(() => {
                    console.log('Record updated');
                    navigation.navigate('LastEvents');
                    showMessage({
                        message: "Record updated.",
                        type: 'success',
                    })
                });
            } if (selectedCategory === 'Insurance') {
                maintenanceRef.update({
                    Category: selectedCategory,
                    Price: price,
                    Date: formattedDate,
                    Odometer: odo,
                    Note: note,
                }).then(() => {
                    console.log('Record updated');
                    navigation.navigate('LastEvents');
                    showMessage({
                        message: "Record updated.",
                        type: 'success',
                    })
                });
            }
        } else {
            console.error('User ID not found in AsyncStorage');
        }
    };

    const onClosePress = () =>{
        navigation.navigate('ViewRecord', { id:id, data: recordDetails });
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
            <View style={[sty.AppContainer, { backgroundColor: '#F4F4F4' }]}>
                <Appbar.Header style={{ backgroundColor: 'white' }}>
                    <Appbar.Content title='close' onPress={onClosePress} />
                    <Appbar.Content title='Edit' titleStyle={{ textAlign: 'center' }} />
                    <Appbar.Content title='Save' onPress={onSavePress} color='#1691F7' style={{ alignItems: 'flex-end', paddingRight: 10 }} />
                </Appbar.Header>

                <View style={{ marginTop: 0, height: 140, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        keyboardType='numeric'
                        defaultValue={price}
                        onChangeText={(text) => setPrice(text)}
                        cursorColor={'#F4F4F4'}
                        style={{ textAlign: 'center', fontSize: 80, color: 'black', fontFamily: 'Poppins-Regular', paddingRight: 10, borderWidth: 0 }}
                    />
                    <Text style={{ fontSize: 30, color: 'black', fontFamily: 'Poppins-Regular', paddingRight: 5 }}> LKR </Text>
                </View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%', paddingTop: '1%', paddingBottom: '1%' }}>
                    <View style={[styles.recordPic, { backgroundColor: '#FFEE96' }]}>
                        <Image source={require('../../../assets/img/Fuel/category.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                        <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Regular', fontSize: 17 }}>Category</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'right', fontSize: 17, color: 'black', fontFamily: 'Poppins-Regular' }}>{recordDetails.Category}</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: '5%', alignItems: 'center' }}>
                    <View style={[styles.recordPic, { backgroundColor: '#8BE8BD' }]}>
                        <Image source={require('../../../assets/img/Fuel/day.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                        <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Date</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                        <TouchableOpacity onPress={showDatePicker}>
                            <Text style={{fontSize: 17, color: '#0B0B0B'}}> {recordDetails.Date} </Text>
                        </TouchableOpacity>
                        {show && (
                            <DateTimePicker testID='dateTimePicker' value={date} mode='date' onChange={onChange} />
                        )}
                    </View>
                </View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: '5%', alignItems: 'center' }}>
                    <View style={[styles.recordPic, { backgroundColor: '#97F1EC' }]}>
                        <Image source={require('../../../assets/img/Fuel/odo.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                        <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Odometer</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                        <TextInput
                            keyboardType='numeric'
                            defaultValue={odo}
                            onChangeText={setOdo}
                            placeholder='_____'
                            style={{ fontSize: 17, color: '#0B0B0B' }}
                        />
                    </View>
                </View>

                {recordDetails.Category === 'Fuel' && <FuelOption priceLiter={priceLiter} setPriceLiter={setPriceLiter} liters={liters} setLiters={setLiters} />}
                {recordDetails.Category === 'Service' && <ServiceOption serviceType={serviceType} setServiceType={setServiceType} garageName={garageName} setGarageName={setGarageName} />}

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                    <View style={styles.recordPic}>
                        <Image source={require('../../../assets/img/Fuel/note.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                        <TextInput
                            defaultValue={note}
                            onChangeText={setNote}
                            placeholder='Note '
                            placeholderTextColor={'#D2D2D2'}
                            style={{ fontFamily: 'Poppins-Medium', fontSize: 17 }}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaProvider>
    );
};

const FuelOption: React.FC<FuelOptionProps> = ({ priceLiter, setPriceLiter, liters, setLiters }) => (
    <View>
        <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: '5%' }}>
            <View style={styles.recordPic}>
                <Image source={require('../../../assets/img/Fuel/pricel.png')} style={{ width: 25, height: 25 }} />
            </View>
            <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                <Text style={{ color: '#D2D2D2', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Price/Liter</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TextInput
                    keyboardType='numeric'
                    defaultValue={priceLiter}
                    onChangeText={setPriceLiter}
                    placeholder='____'
                    style={{ fontSize: 17 }}
                />
                <Text style={{ fontSize: 17, color: '#0B0B0B' }} >LKR</Text>
            </View>
        </View>

        <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
            <View style={styles.recordPic}>
                <Image source={require('../../../assets/img/Fuel/liters.png')} style={{ width: 25, height: 25 }} />
            </View>
            <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                <Text style={{ color: '#D2D2D2', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Liter</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TextInput
                    keyboardType='numeric'
                    defaultValue={liters}
                    onChangeText={setLiters}
                    placeholder='_____'
                />
            </View>
        </View>
    </View>
);

const ServiceOption: React.FC<ServiceOptionProps> = ({ serviceType, setServiceType, garageName, setGarageName }) => (
    <View>
        <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
            <View style={styles.recordPic}>
                <Icon name='checklist' type='octicon' color={'#d6d6d6'} size={20} />
            </View>
            <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                <Text style={{ color: '#D2D2D2', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Service Type</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TextInput
                    defaultValue={serviceType}
                    onChangeText={setServiceType}
                    placeholder='_____'
                />
            </View>
        </View>

        <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
            <View style={styles.recordPic}>
                <Icon name='garage' type='material-community' color={'#d6d6d6'} style={{ width: 30, height: 30 }} />
            </View>
            <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                <Text style={{ color: '#D2D2D2', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Garage Name</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <TextInput
                    defaultValue={garageName}
                    onChangeText={setGarageName}
                    placeholder='_____'
                />
            </View>
        </View>
    </View>
);

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

export default EditRecordScreen;
