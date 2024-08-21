import { View, Text, StatusBar, Image, ScrollView, BackHandler, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, Drawer } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import firebase from 'firebase/compat/app'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

interface ItemData {
    id: string;
    data: FirebaseFirestoreTypes.DocumentData;
}

const HomeAdmin = (navigation: any) => {

    const [spareParts, setSpareParts] = useState<ItemData[]>([]);
    const [workshop, setWorkshop] = useState<ItemData[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const handleBackPress = () => {
                Alert.alert('Exit App', 'Are you sure you want to exit?', [
                    {
                        text: 'Cancel',
                        onPress: () => null,
                        style: 'cancel'
                    },
                    {
                        text: 'Exit',
                        onPress: () => BackHandler.exitApp(),
                    }
                ]);
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', handleBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            };
        }, []),
    );

    useEffect(() => {
        getSpareParts();
        getMechanics();
    }, [])


    const getSpareParts = async () => {
        try {
            const data = await firebase.firestore().collection('items');
            const querySnapshot = await data.get();

            const tempData: ItemData[] = [];

            querySnapshot.forEach(collectionSnapshot => {
                tempData.push({
                    id: collectionSnapshot.id,
                    data: collectionSnapshot.data(),
                });
            })

            setSpareParts(tempData);
            console.log(spareParts)

        } catch (error) {
            console.error('Error fetching spareparts: ', error);
        }
    }

    const getMechanics = async () => {
        try {
            const data = await firebase.firestore().collection('Mechanics');
            const querySnapshot = await data.get();

            console.log(querySnapshot.size);

            const mecData: ItemData[] = [];

            querySnapshot.forEach(collectionSnapshot => {
                mecData.push({
                    id: collectionSnapshot.id,
                    data: collectionSnapshot.data(),
                })
            })
            setWorkshop(mecData);
            console.log(workshop);
        } catch (error) {
            console.error('Error fetching mechanics: ', error);
        }
    }

    return (
        <SafeAreaProvider>
            <View>

                <StatusBar backgroundColor={'#291D7D'} />

                <Appbar.Header style={{ backgroundColor: '#11046E' }}>
                    <Appbar.Action icon={'menu'} color='#11046E' />
                    <Appbar.Content title='PitCrew' color='white' style={{ alignItems: 'center', }} />
                    <Appbar.Action icon={'cart'} color='#11046E' />
                </Appbar.Header>

                <Text style={{
                    color: '#11046E',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    marginLeft: '5%',
                    marginTop: '7%'
                }}>Recently added</Text>


                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', width: 600, paddingLeft: '5%', }}>
                        {spareParts.map(item => {
                            return (
                                <View key={item.id} style={{ marginTop: '2%', flexDirection: 'column' }}>
                                    <View style={{ width: 170, height: 230, backgroundColor: 'white', alignItems: 'center', marginRight: '2%' }}>
                                        <View style={{ marginTop: '5%' }}>
                                            <Image source={{ uri: item.data.imageUrl }} style={{ width: 130, height: 130 }} />
                                        </View>
                                        <View style={{ marginTop: '5%', alignItems: 'center' }}>
                                            <Text style={{ color: '#02010B', fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>{item.data.name}</Text>
                                            <Text style={{ paddingBottom: 5, textDecorationLine: 'line-through' }} >{'Rs. ' + item.data.price}</Text>
                                        </View>
                                        <View style={{ width: 170, height: 30, backgroundColor: '#291D7D', justifyContent: 'center' }}>
                                            <Text style={{ color: '#FF0000', textAlign: 'center', fontFamily: 'Poppins-SemiBold', fontSize: 18, paddingTop: 2 }}>{'Rs. ' + item.data.discountPrice}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>

                <Text style={{
                    color: '#11046E',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    marginLeft: '5%',
                    marginTop: '7%'
                }}>Popular Workshops
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', width: 700, paddingLeft: '4.5%' }}>
                        {workshop.map(item => {
                            return (
                                <View key={item.id} style={{ marginTop: '2%', flexDirection: 'column' }}>
                                    <View style={{ width: 200, height: 220, alignItems: 'center', marginRight: '2%', backgroundColor: 'red' }}>
                                        <Image source={require('../../assets/img/WorkShops/ws1.png')} style={{ width: 200, height: 160 }} />
                                        <View style={{ width: 200, height: 60, backgroundColor: '#291D7D', justifyContent: 'center' }}>
                                            <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>{item.data.workshopName}</Text>
                                            <Text style={{ color: '#FFA500', textAlign: 'center', fontFamily: 'Poppins-Medium', fontSize: 16 }}>{item.data.address}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>

            </View>
        </SafeAreaProvider>
    )
}

export default HomeAdmin