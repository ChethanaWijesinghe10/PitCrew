import { View, Text, TouchableOpacity, Image, StatusBar, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { sty } from '../../styles/Styles'
import { Appbar, Button } from 'react-native-paper'
import { Icon } from '@rneui/base'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firebase from 'firebase/compat/app'

import fuelImage from '../../../assets/img/Fuel/fuel.png';
import serviceImage from '../../../assets/img/Fuel/service.png';
import insuranceImage from '../../../assets/img/Fuel/insurance.png';

interface ItemData {
    id: string;
    data: FirebaseFirestoreTypes.DocumentData;
}

const FuelHome = (props: any) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [items, setItems] = useState<ItemData[]>([]);
    const [reminders, setReminders] = useState<ItemData[]>([]);
    const [eventcount, setEventCount] = useState<Number>(0);
    const [remindercount, setReminderCount] = useState<Number>(0);
    const [totalCost, setTotalCost] = useState<Number>(0);
    const [odo, setOdo] = useState('');
    const [fuelRecords, setFuelRecords] = useState<ItemData[]>([]);
    const [fuelEfficiency, setFuelEfficiency] = useState<number | null>(null);

    function gotoNewReport() {
        navigation.navigate("NewReport" as never);
    }

    useEffect(() => {
        if (isFocused) {
            getEvents();
            getReminders();
        }
    }, [isFocused]);

    useEffect(() => {
        calculateFuelEfficiency();
    }, [fuelRecords]);

    const getEvents = async () => {
        try {
            const uid = await AsyncStorage.getItem('USERID');

            if (!uid) {
                console.error('User ID not found in AsyncStorage');
                return;
            }

            const query = await firebase.firestore()
                .collection('MaintenanceRecords')
                .where('UserId', '==', uid)
                .orderBy('Date', 'desc');

            const querySnapshot = await query.limit(3).get();
            const allquery = await query.get();

            console.log('Total records: ', querySnapshot.size);
            setEventCount(querySnapshot.size);
            const tempData: ItemData[] = [];
            const fuelData: ItemData[] = [];
            
            querySnapshot.forEach(collectionSnapshot => {
                // console.log('Item Id: ', collectionSnapshot.id, collectionSnapshot.data());
                tempData.push({
                    id: collectionSnapshot.id,
                    data: collectionSnapshot.data(),
                });
                if (collectionSnapshot.data().Category === 'Fuel') {
                    fuelData.push({
                        id: collectionSnapshot.id,
                        data: collectionSnapshot.data(),
                    });
                }
            });
            setItems(tempData);
            setFuelRecords(fuelData);

            let total = 0;
            let currentOdo = 0;
            let lastOdo = 0;
            allquery.forEach(coutTotal => {
                const data = coutTotal.data();
                total += parseFloat(data.Price) || 0;
                currentOdo = data.Odometer;
                if (currentOdo > lastOdo) {
                    lastOdo = currentOdo;
                }
            });
            setTotalCost(total / 1000);
            setOdo(lastOdo.toString());
        } catch (error) {
            console.error('Error fetching items: ', error);
        }
    };

    const getReminders = async () => {
        try {
            const uid = await AsyncStorage.getItem('USERID');

            if (!uid) {
                console.error('User ID not found in AsyncStorage');
                return;
            }

            const querySnapshot = await firebase.firestore()
                .collection('RemainderRecords')
                .where('UserId', '==', uid)
                .orderBy('CreatedAt', 'desc')
                .limit(3)
                .get();

            console.log('Total records: ', querySnapshot.size);
            setReminderCount(querySnapshot.size);
            const tempData: ItemData[] = [];
            querySnapshot.forEach(collectionSnapshot => {
                console.log('Item Id: ', collectionSnapshot.id, collectionSnapshot.data());
                tempData.push({
                    id: collectionSnapshot.id,
                    data: collectionSnapshot.data(),
                });
            });
            setReminders(tempData);
        } catch (error) {
            console.error('Error fetching items: ', error);
        }
    };

    const calculateFuelEfficiency = () => {
        if (fuelRecords.length < 2) {
            setFuelEfficiency(null);
            return;
        }

        let totalDistance = 0;
        let totalFuel = 0;

        for (let i = 1; i < fuelRecords.length; i++) {
            totalDistance += parseFloat(fuelRecords[i].data.Odometer) - parseFloat(fuelRecords[i - 1].data.Odometer);
            totalFuel += parseFloat(fuelRecords[i].data.Liters);

        }
        console.log('Distance ' + totalDistance);
        console.log('Fuel ' + totalFuel)

        const efficiency = totalDistance / totalFuel;
        console.log(efficiency);
        setFuelEfficiency(efficiency);
    };

    const getImageAndColorForCategory = (category: string) => {
        switch (category) {
            case 'Fuel':
                return { image: fuelImage, color: '#FFEE96' };
            case 'Maintenance':
                return { image: serviceImage, color: '#8BE8BD' };
            case 'Insurance':
                return { image: insuranceImage, color: '#C6B3FF' };
            default:
                return { image: null, color: '#ffff' };
        }
    };

    return (
        <SafeAreaProvider>
            <View style={[sty.AppContainer, { backgroundColor: '#F4F4F4' }]}>
                <StatusBar backgroundColor={'#291D7D'} />

                <View style={{ alignItems: 'center', marginTop: '3%', flexDirection: 'row', marginBottom: '1.5%', alignSelf: 'center' }}>
                    <HomeContainer btnLabel={'LKR ' + totalCost.toFixed(1) + 'K'} text="All Costs" ></HomeContainer>
                    <HomeContainer btnLabel={odo} text="Odometer" ></HomeContainer>
                    <HomeContainer btnLabel={fuelEfficiency ? fuelEfficiency.toFixed(1) + ' km/l' : 'N/A'} text="Average" ></HomeContainer>
                </View>

                {
                    eventcount == 0 ? (
                        <View style={{ marginTop: 10, marginHorizontal: '4%', backgroundColor: '#E8E7E7', borderRadius: 20, padding: 5 }}>
                            <View style={{ marginTop: '3%', flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20, marginLeft: '8%', fontFamily: 'Poppins-Bold', color: 'black' }}>Last Events</Text>
                                <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                                    <Icon name='right' type='antdesign' size={20} style={{ marginRight: 10, marginTop: 5 }} />
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: '20%', marginBottom: '20%' }} >
                                <Text style={{ fontSize: 15 }} >No any records</Text>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity activeOpacity={0.7} onPress={() => { navigation.navigate('LastEvents' as never) }}>
                            <View style={{ marginTop: '1.5%', marginHorizontal: '4%', backgroundColor: '#E8E7E7', borderRadius: 20, padding: 5 }}>
                                <View style={{ marginTop: '3%', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 20, marginLeft: '8%', fontFamily: 'Poppins-Bold', color: 'black' }}>Last Events</Text>
                                    <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                                        <Icon name='right' type='antdesign' size={20} style={{ marginRight: 10, marginTop: 5 }} />
                                    </View>
                                </View>
                                {items.map(item => {
                                    const { image, color } = getImageAndColorForCategory(item.data.Category);
                                    return (
                                        <View key={item.id} style={{ marginTop: 3 }}>
                                            <View style={{ backgroundColor: '#E8E7E7', flexDirection: 'row', paddingHorizontal: '3%' }}>
                                                <View style={[styles.recordPic, { backgroundColor: color }]}>
                                                    <Image source={image} style={{ width: 25, height: 25 }} />
                                                </View>
                                                <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                                                    <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>{item.data.Category}</Text>
                                                    <Text style={{ color: '#8A8A8A', fontSize: 14 }}>{item.data.Date}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                    <Text style={{ textAlign: 'right', fontSize: 16, color: 'black', fontFamily: 'Poppins-Medium' }}>{'LKR' + item.data.Price}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </TouchableOpacity>
                    )
                }

                {
                    remindercount == 0 ? (
                        <View style={{ marginTop: 10, marginHorizontal: '4%', backgroundColor: '#E8E7E7', borderRadius: 20, padding: 5 }}>
                            <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20, marginLeft: '8%', fontFamily: 'Poppins-Bold', color: 'black' }}>Reminders</Text>
                                <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                                    <Icon name='right' type='antdesign' size={20} style={{ marginRight: 10, marginTop: 5 }} />
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: '20%', marginBottom: '20%' }} >
                                <Text style={{ fontSize: 15 }} >No any records</Text>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity activeOpacity={0.7} onPress={() => { navigation.navigate('Remainders' as never) }} >
                            <View style={{ marginTop: '4%', marginHorizontal: '4%', backgroundColor: '#E8E7E7', borderRadius: 20, padding: 5 }}>
                                <View style={{ marginTop: '3%', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 20, marginLeft: '8%', fontFamily: 'Poppins-Bold', color: 'black' }}>Reminders</Text>
                                    <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                                        <Icon name='right' type='antdesign' size={20} style={{ marginRight: 10, marginTop: 5 }} />
                                    </View>
                                </View>
                                {reminders.map(item => {
                                    const { image, color } = getImageAndColorForCategory(item.data.Category);
                                    return (
                                        <View key={item.id} style={{ marginTop: 3 }}>
                                            <View style={{ backgroundColor: '#E8E7E7', flexDirection: 'row', paddingHorizontal: '3%' }}>
                                                <View style={[styles.recordPic, { backgroundColor: color }]}>
                                                    <Image source={image} style={{ width: 25, height: 25 }} />
                                                </View>
                                                <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                                                    <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>{item.data.Note}</Text>
                                                    <Text style={{ color: '#8A8A8A', fontSize: 14 }}>{item.data.Category}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                    <Text style={{ textAlign: 'right', fontSize: 16, color: 'black', fontFamily: 'Poppins-Medium' }}>{item.data.RemindDate}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </TouchableOpacity>
                    )
                }
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 15 }}>
                    <Button onPress={gotoNewReport} mode='contained' style={{ backgroundColor: '#35343C', marginHorizontal: 15, height: 45 }}>
                        <Text>Add Report</Text>
                    </Button>
                </View>

            </View>
        </SafeAreaProvider>
    )
}

function HomeContainer(p: any) {
    return (
        <View style={{
            backgroundColor: '#E8E7E7',
            alignItems: 'center',
            justifyContent: 'center',
            height: 80,
            marginLeft: '2.5%',
            marginRight: '1%',
            width: '27.5%',
            borderRadius: 15
        }}>
            <Text style={{ fontFamily: 'Poppins-Medium', color: 'black', fontSize: 20, fontWeight: 'bold', marginTop: '5%', marginBottom: '5%' }}>
                {p.btnLabel}
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular', color: '#67676D' }} >{p.text}</Text>
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
        marginTop: '3%',
        marginBottom: '3%'
    }
})

export default FuelHome
