import { View, Text, StatusBar, ScrollView, Image, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, Button } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import firebase from 'firebase/compat/app';
import { DocumentData } from 'firebase/firestore';
import { showMessage } from 'react-native-flash-message';

type RecordDetails = {
    category: string;
    date: Date;
    note: string;
};

type RootStackParamList = {
    Remainders: undefined;
    ViewRemainderScreen: { id: string; data: RecordDetails; };
    EditRemainder: { id: string; data: RecordDetails; };
};

type ViewItemRouteProp = RouteProp<RootStackParamList, 'ViewRemainderScreen'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const ViewRemainderScreen = (props: any) => {

    const route = useRoute<ViewItemRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { id, data } = route.params;
    const [recordDetails, setRecordDetails] = useState<DocumentData | null | undefined>(null);

    useEffect(() => {
        const fetchRecordDetails = async () => {
            try {
                const recordRef = firebase.firestore().collection('RemainderRecords').doc(id);
                const doc = await recordRef.get();
                if (doc.exists) {
                    const recordData = doc.data() as RecordDetails;
                    setRecordDetails(recordData);
                }
            } catch (error) {
                console.error('Error fetching record details:', error);
            }
        };

        fetchRecordDetails();
    }, [id]);

    const onDeletePress = () => {
        if (!id) {
            console.error('Invalid record ID');
            return;
        }
        Alert.alert('Confirm delete', 'Do you really want to delete this record', [
            {
                text: 'No',
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        await firebase.firestore().collection('RemainderRecords').doc(id).delete();
                        navigation.navigate('Remainders', { id: id, data: recordDetails } as never);
                        showMessage({
                            message: 'Record deleted!',
                            type: 'info',
                            backgroundColor: '#1691F7',
                        });
                    } catch (error) {
                        console.error('Error deleting record:', error);
                    }
                },
            },
        ]);
    };

    const onEditPress = () => {
        if (recordDetails) {
            navigation.navigate('EditRemainder', { id, data: recordDetails } as never);
        }
    };

    if (!recordDetails) {
        return (
            <SafeAreaProvider>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: '#F4F4F4' }} >

                <Appbar.Header style={{ backgroundColor: 'white' }}>
                    <Appbar.Content title='Cancel' onPress={() => { navigation.navigate('Remainders') }} titleStyle={{ fontSize: 20 }} color='#616161' style={{ alignItems: 'flex-start' }} />
                    <Appbar.Content title='Remainder' titleStyle={{ fontSize: 20 }} color='#0B0B0B' style={{ alignItems: 'center' }} />
                    <Appbar.Content title='Edit' onPress={ onEditPress } titleStyle={{ fontSize: 20 }} color='#1691F7' style={{ alignItems: 'flex-end', marginRight: 10 }} />
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
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'right', fontSize: 17, color: '#8A8A8A' }}>{recordDetails.Category}</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                    <View style={[styles.recordPic, { backgroundColor: '#8BE8BD' }]}>
                        <Image source={require('../../../assets/img/Fuel/remaind.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 15, justifyContent: 'center' }}>
                        <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-Medium', fontSize: 17 }}>Remaind me in</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'right', fontSize: 17, color: '#8A8A8A' }}>{recordDetails.RemindDate}</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%' }}>
                    <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                        <Image source={require('../../../assets/img/Fuel/note.png')} style={{ width: 25, height: 25 }} />
                    </View>
                    <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                        <Text style={{fontFamily:  'Poppins-Regular',fontSize: 17}}>{recordDetails.Note}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 15 }}>
                    <Button onPress={onDeletePress} mode="contained" style={{ backgroundColor: '#35343C', marginHorizontal: 15, height: 45 }}>
                        <Text>Delete Report</Text>
                    </Button>
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
        marginTop: '3%',
        marginBottom: '3%'
    }
})

export default ViewRemainderScreen