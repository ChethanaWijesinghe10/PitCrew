import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
// import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid' 
import { Appbar } from 'react-native-paper';
const AddNewAddress: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobile, setMobile] = useState('');

  const saveAddress = async () => {
    const addressId = uuid.v4();
    try {
      const userId = await AsyncStorage.getItem('USERID');
      if (!userId) {
        throw new Error('USERID is null or undefined');
      }
      const userDoc = await firestore().collection('VehicleOwners').doc(userId).get();
      let tempDart: any[] = userDoc.get('address') || [];
      tempDart.push({ street, city, pincode, mobile, addressId });
      await firestore().collection('VehicleOwners').doc(userId).update({ address: tempDart });
      console.log('successfully added');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  return (
    <View style={styles.container}>
         {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
          <Image source={require('../images/arrow.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Go Back</Text>
      </View> */}
      <Appbar.Header style={{ backgroundColor: '#291D7D' }}>
        <Appbar.BackAction color='white' onPress={() => navigation.navigate('Address')} />
        <Appbar.Content title='Add New Address' color='white' style={{ alignItems: 'center', }} />
        <Appbar.Action icon={'cart'} color='#291D7D' onPress={() => navigation.navigate('Cart')} />
      </Appbar.Header>
      <TextInput
        style={styles.inputStyle}
        placeholder={'Enter Street'}
        value={street}
        onChangeText={(txt) => setStreet(txt)}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder={'Enter City '}
        value={city}
        onChangeText={(txt) => setCity(txt)}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder={'Enter Pincode'}
        value={pincode}
        keyboardType="number-pad"
        onChangeText={(txt) => setPincode(txt)}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder={'Enter Contact '}
        value={mobile}
        maxLength={10}
        keyboardType="number-pad"
        onChangeText={(txt) => setMobile(txt)}
      />
      <TouchableOpacity style={styles.addNewBtn} onPress={saveAddress}>
        <Text style={styles.btnText}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyle: {
    paddingLeft: 20,
    height: 50,
    alignSelf: 'center',
    marginTop: 30,
    borderWidth: 0.5,
    borderRadius: 10,
    width: '90%',
  },
  addNewBtn: {
    width: '90%',
    height: 50,
    backgroundColor: '#291D7D',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#291D7D',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    flex: 1,
  },
  arrowIcon: {
    marginRight: 20,
    
  }, 
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

