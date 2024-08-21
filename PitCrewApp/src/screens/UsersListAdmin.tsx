import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Alert, Linking, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const UsersListAdmin = () => {
  const [workshops, setWorkshops] = useState<{ id: string }[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('VehicleOwners')
      .onSnapshot((querySnapshot) => {
        const userssData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkshops(userssData);
      });

    return () => unsubscribe();
  }, []);

  const deleteWorkshop = (id: string | undefined) => {
    Alert.alert('Delete User', 'Are you sure you want to delete this user!', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {
            firestore()
      .collection('VehicleOwners')
      .doc(id)
      .delete()
      .then(() => {
        Alert.alert('User deleted!', 'The User has been successfully deleted.');
      });
        }},
      ]);
  };

  const renderItem = ({ item }) => (
    <KeyboardAwareScrollView>
    <View style={styles.itemContainer}>
      <Image source={require('../../assets/img/WorkShops/ws1.png')} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.email}</Text>
        <Text style={styles.description}>{item.contactNo}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteWorkshop(item.id)} style={{ flexDirection: 'row'}}>
            <Icon name="delete" size={30} color="#ff0000" />
          </TouchableOpacity>
    </View>
    </KeyboardAwareScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Users List</Text>
      </View>
      <FlatList
        data={workshops}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#11046E',
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  itemContainer: {
    flexDirection: 'row' as 'row',  
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 5,
  },
  iconsContainer: {
    flexDirection: 'row' as 'row',  
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default UsersListAdmin;