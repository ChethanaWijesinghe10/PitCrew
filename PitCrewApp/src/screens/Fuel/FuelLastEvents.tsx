import { View, Text, StatusBar, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { sty } from '../../styles/Styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import firesore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firebase from 'firebase/compat/app'

import fuelImage from '../../../assets/img/Fuel/fuel.png';
import serviceImage from '../../../assets/img/Fuel/service.png';
import insuranceImage from '../../../assets/img/Fuel/insurance.png';

interface ItemData {
    id: string;
    data: FirebaseFirestoreTypes.DocumentData;
}

const FuelLastEvents = (props: any) => {

    const stack = props.navigation;

    const isFocused = useIsFocused();
    const [items, setItems] = useState<ItemData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        if (isFocused) {
            getItems();
        }
    }, [isFocused, selectedCategory]);

    const getItems = async () => {
        try {
            const uid = await AsyncStorage.getItem('USERID');

            if (!uid) {
                console.error('User ID not fount in AsyncStorage');
                return;
            }

            let query = firebase.firestore()
                .collection('MaintenanceRecords')
                .where('UserId', '==', uid)
                .orderBy('Date', 'desc')

                if (selectedCategory) {
                    query = query.where('Category', '==', selectedCategory);
                }
    
                const querySnapshot = await query.get();

            console.log('Total records: ', querySnapshot.size);
            const tempData: ItemData[] = [];
            querySnapshot.forEach(collectionSnapshot => {
                // console.log('Item Id: ', collectionSnapshot.id, collectionSnapshot.data());
                tempData.push({
                    id: collectionSnapshot.id,
                    data: collectionSnapshot.data(),
                });
            });
            setItems(tempData);
        } catch (error) {
            console.error('Error fetching items: ', error);
        }
    };

    const getImageAndColorForCategory = (category: string) => {
        switch (category) {
            case 'Fuel':
                return { image: fuelImage, color: '#FFEE96' };
            case 'Service':
                return { image: serviceImage, color: '#8BE8BD' };
            case 'Insurance':
                return { image: insuranceImage, color: '#C6B3FF' };
            default:
                return { image: null, color: '#ffff' };
        }
    };

    return (
        <SafeAreaProvider>
            <View style={sty.AppContainer} >

                <Appbar.Header>
                    <Appbar.BackAction color='black' onPress={() => { stack.navigate('FuelHome') }} />
                    <Appbar.Content title='Last Events' color='black' style={{ alignItems: 'center', marginLeft: '-12%' }} />
                </Appbar.Header>

                <StatusBar backgroundColor={'#291D7D'} />

                <ScrollView>
                    <View style={{ flexDirection: 'row', marginTop: '5%', marginBottom: '5%' }} >
                    <SegmentedPicker width={60} title={'All'} onPress={() => setSelectedCategory(null)} />
                        <SegmentedPicker width={70} title={'Fuel'} onPress={() => setSelectedCategory('Fuel')} />
                        <SegmentedPicker width={100} title={'Insurance'} onPress={() => setSelectedCategory('Insurance')} />
                        <SegmentedPicker width={100} title={'Service'} onPress={() => setSelectedCategory('Service')} />
                    </View>


                    {items.map(item => {
                        const { image, color } = getImageAndColorForCategory(item.data.Category);
                        return (
                            <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => { stack.navigate('ViewRecord', { id: item.id, data: item.data }) }}>
                                <View style={{ backgroundColor: '#F5F5F5', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                                    <View style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 100,
                                        backgroundColor: color,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}>
                                        <Image source={image} style={{ width: 25, height: 25 }} />
                                    </View>
                                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                                        <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>{item.data.Category}</Text>
                                        <Text style={{ color: '#8A8A8A' }}>{item.data.Date}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'right', fontFamily: 'Poppins-Medium', fontSize: 17, color: 'black' }}>{'LKR' + item.data.Price}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                </ScrollView>
            </View>
        </SafeAreaProvider>
    )
}

function SegmentedPicker({ width, title, onPress }: { width: number, title: string, onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} style={{
            width,
            height: 40,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F5F5',
            borderRadius: 20,
            marginLeft: 10,
        }}>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#0B0B0B' }}>{title}</Text>
        </TouchableOpacity>
    );
}

export default FuelLastEvents