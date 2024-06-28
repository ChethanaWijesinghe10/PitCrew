import { View, Text, StatusBar, Image, Alert, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Appbar, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import { DocumentData } from 'firebase/firestore';
import { Icon } from '@rneui/base';
import { StackNavigationProp } from '@react-navigation/stack';

type RecordDetails = {
  category: string;
  price: string;
  date: Date;
  odo: string;
  priceLiter?: string;
  liters?: string;
  serviceType?: string;
  garageName?: string;
  note: string;
};

type RootStackParamList = {
  LastEvents: undefined;
  ViewRecordScreen: { id: string; data: RecordDetails; };
  EditRecord: { id: string; data: RecordDetails; };
};


type ViewItemRouteProp = RouteProp<RootStackParamList, 'ViewRecordScreen'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const ViewRecordScreen = (props: any) => {
  const route = useRoute<ViewItemRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { id, data } = route.params;
  const [recordDetails, setRecordDetails] = useState<DocumentData | null | undefined>(null);

  useEffect(() => {
    const fetchRecordDetails = async () => {
      try {
        const recordRef = firebase.firestore().collection('MaintenanceRecords').doc(id);
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
            await firebase.firestore().collection('MaintenanceRecords').doc(id).delete();
            navigation.navigate('LastEvents', {id: id, data: recordDetails} as never);
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
      navigation.navigate('EditRecord', { id, data: recordDetails } as never);
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
      <View style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
        <Appbar.Header style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction color="black" onPress={() => navigation.navigate('LastEvents' as never)} />
          <Appbar.Content title="Record Details" color="#0B0B0B" titleStyle={{ fontSize: 20 }} style={{ alignItems: 'center' }} />
          <Appbar.Content title="Edit" onPress={ onEditPress } titleStyle={{fontSize: 17, color: '#1691F7'}} style={{ alignItems: 'flex-end', paddingRight: 10 }} />
        </Appbar.Header>

        <StatusBar backgroundColor={'#291D7D'} />

        <View style={{ marginHorizontal: 10, marginTop: 30 }}>
          <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '4%', paddingRight: '5%', paddingBottom: '1%', paddingTop: '2%', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <View
              style={[styles.recordPic, { backgroundColor: '#C6B3FF' }]}>
              <Image source={require('../../../assets/img/Fuel/amount.png')} style={{ width: 25, height: 25 }} />
            </View>
            <View style={{ marginLeft: 12, justifyContent: 'center' }}>
              <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Amount</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'right', fontSize: 17, fontFamily: 'Poppins-Regular' }}>{'Rs. ' + recordDetails.Price}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#d9d9db' }} />
          </View>

          <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '4%', paddingRight: '5%', paddingTop: '1%', paddingBottom: '1%' }}>
            <View style={[styles.recordPic, { backgroundColor: '#FFEE96' }]}>
              <Image source={require('../../../assets/img/Fuel/category.png')} style={{ width: 25, height: 25 }} />
            </View>
            <View style={{ marginLeft: 12, justifyContent: 'center' }}>
              <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-SemiBold', fontSize: 17, fontWeight: 'bold' }}>Category</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'right', fontSize: 17 }}>{recordDetails.Category}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#d9d9db' }} />
          </View>

          <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '4%', paddingRight: '5%', paddingTop: '1%', paddingBottom: '1%' }}>
            <View style={[styles.recordPic, { backgroundColor: '#8BE8BD' }]}>
              <Image source={require('../../../assets/img/Fuel/day.png')} style={{ width: 25, height: 25 }} />
            </View>
            <View style={{ marginLeft: 12, justifyContent: 'center' }}>
              <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Date</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'right', fontSize: 17 }}>{recordDetails.Date ? recordDetails.Date : 'N/A'}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#d9d9db' }} />
          </View>

          <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '4%', paddingRight: '5%', paddingTop: '1%', paddingBottom: '2%' }}>
            <View style={[styles.recordPic, { backgroundColor: '#97F1EC' }]}>
              <Image source={require('../../../assets/img/Fuel/odo.png')} style={{ width: 25, height: 25 }} />
            </View>
            <View style={{ marginLeft: 12, justifyContent: 'center' }}>
              <Text style={{ color: '#0B0B0B', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Odometer</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'right', fontSize: 17 }}>{recordDetails.Odometer + ' km' }</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#d9d9db' }} />
          </View>
          {
            recordDetails.Category === 'Fuel' && (
              <View>
                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '4%', paddingRight: '5%', paddingTop: '1%', paddingBottom: '1%' }}>
                  <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                    <Image source={require('../../../assets/img/Fuel/pricel.png')} style={{ width: 25, height: 25 }} />
                  </View>
                  <View style={{ marginLeft: 12, justifyContent: 'center' }}>
                    <Text style={{ color: '#D2D2D2', fontFamily: 'Poppins-SemiBold', fontSize: 17, fontWeight: 'bold' }}>Price/Liter</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'right', fontSize: 17 }}>{'Rs. ' + recordDetails.PricePLiter}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#d9d9db' }} />
                </View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '4%', paddingRight: '5%', paddingTop: '1%', paddingBottom: '1%' }}>
                  <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                    <Image source={require('../../../assets/img/Fuel/liters.png')} style={{ width: 25, height: 25 }} />
                  </View>
                  <View style={{ marginLeft: 12, justifyContent: 'center' }}>
                    <Text style={{ color: '#D2D2D2', fontFamily: 'Poppins-SemiBold', fontSize: 17, fontWeight: 'bold' }}>Liters</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'right', fontSize: 17 }}>{recordDetails.Liters}</Text>
                  </View>
                </View>
              </View>
            )}

{
            recordDetails.Category === 'Service' && (
              <View>
                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '4%', paddingRight: '5%', paddingTop: '1%', paddingBottom: '1%' }}>
                  <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                  <Icon name='checklist' type='octicon' color={'#d6d6d6'} size={20} />
                  </View>
                  <View style={{ marginLeft: 12, justifyContent: 'center' }}>
                    <Text style={{ color: '#D2D2D2', fontFamily: 'Poppins-SemiBold', fontSize: 17, fontWeight: 'bold' }}>Service Type</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'right', fontSize: 17 }}>{recordDetails.ServiceType}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: '#d9d9db' }} />
                </View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '4%', paddingRight: '5%', paddingTop: '1%', paddingBottom: '1%' }}>
                  <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
                  <Icon name='garage' type='material-community' color={'#d6d6d6'} style={{ width: 30, height: 30 }} />
                  </View>
                  <View style={{ marginLeft: 12, justifyContent: 'center' }}>
                    <Text style={{ color: '#D2D2D2', fontFamily: 'Poppins-SemiBold', fontSize: 17, fontWeight: 'bold' }}>Garage Name</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'right', fontSize: 17 }}>{recordDetails.GarageName}</Text>
                  </View>
                </View>
              </View>
            )}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#d9d9db' }} />
          </View>

          <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingLeft: '4%', paddingRight: '5%', paddingTop: '1%', paddingBottom: '1%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            <View style={[styles.recordPic, { backgroundColor: '#F5F5F5' }]}>
              <Image source={require('../../../assets/img/Fuel/note.png')} style={{ width: 25, height: 25 }} />
            </View>
            <View style={{ marginLeft: 12, justifyContent: 'center' }}>
              <Text style={{ color: '#D2D2D2', fontFamily: 'Poppins-SemiBold', fontSize: 17, fontWeight: 'bold' }}>Note</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'right', fontSize: 17 }}>{recordDetails.Note}</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 15 }}>
          <Button onPress={onDeletePress} mode="contained" style={{ backgroundColor: '#35343C', marginHorizontal: 15, height: 45 }}>
            <Text>Delete Report</Text>
          </Button>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  recordPic: {
    height: 40,
    width: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  }
})

export default ViewRecordScreen;
