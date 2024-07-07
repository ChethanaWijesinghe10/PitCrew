import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Icon } from '@rneui/base';

interface AddressItem {
  addressId: string;
  street: string;
  city: string;
  pincode: string;
  mobile: string;
  selected?: boolean;
}

interface AddressProps {
  navigation: any;
}

const Address: React.FC<AddressProps> = ({navigation}) => {
  const [addressList, setAddressList] = useState<AddressItem[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getAddressList();
  }, [isFocused]);

  const getAddressList = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    const addressId = await AsyncStorage.getItem('ADDRESS');

    if (userId) {
      const user = await firestore().collection('VehicleOwners').doc(userId).get();
      let tempDart: AddressItem[] = user.data()?.address || [];

      tempDart = tempDart.map(item => ({
        ...item,
        selected: item.addressId === addressId,
      }));

      setAddressList(tempDart);
    }
  };

  const saveDefaultAddress = async (item: AddressItem) => {
    await AsyncStorage.setItem('ADDRESS', item.addressId);
    const updatedAddressList = addressList.map(itm =>
      itm.addressId === item.addressId ? {...itm, selected: true} : {...itm, selected: false},
    );
    setAddressList(updatedAddressList);
  };

  return (
    <View style={styles.container}>
        {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
          <Image source={require('../../../../assets/img/SpareParts/arrow.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Go Back</Text>
      </View> */}
      <View style={styles.header} >
          <Icon type='ionicons' name='arrow-back' color={'white'} onPress={() => navigation.navigate('Checkout')}/>
            <Text style={{ flex: 1, textAlign: 'center', color: 'white', fontSize: 20, fontWeight: '500'}} >Address</Text>
        </View>
      <FlatList
        data={addressList}
        renderItem={({item, index}) => (
          <View
            style={[
              styles.addressItem,
              {marginBottom: index === addressList.length - 1 ? 100 : 10},
            ]}
          >
            <View>
              <Text>{`Street: ${item.street}`}</Text>
              <Text>{`City: ${item.city}`}</Text>
              <Text>{`Pincode: ${item.pincode}`}</Text>
              <Text>{`Mobile: ${item.mobile}`}</Text>
            </View>
            {item.selected ? (
              <Text>default</Text>
            ) : (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => saveDefaultAddress(item)}
              >
                <Text style={{color: '#fff'}}>Set Default</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={item => item.addressId}
      />
      <TouchableOpacity
        style={styles.addNewBtn}
        onPress={() => navigation.navigate('AddNewAddress')}
      >
        <Text style={styles.btnText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  addressItem: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 4,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'green',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
});
