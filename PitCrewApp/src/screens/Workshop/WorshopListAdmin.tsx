import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Alert, Linking, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WorkshopListAdmin = () => {
  const [workshops, setWorkshops] = useState<{ id: string }[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Mechanics')
      .onSnapshot((querySnapshot) => {
        const workshopsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkshops(workshopsData);
      });

    return () => unsubscribe();
  }, []);

  const deleteWorkshop = (id: string | undefined) => {
    Alert.alert('Delete Workshop', 'Are you sure you want to delete this workshop!', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', onPress: () => {
          firestore()
            .collection('Mechanics')
            .doc(id)
            .delete()
            .then(() => {
              Alert.alert('Workshop deleted!', 'The workshop has been successfully deleted.');
            });
        }
      },
    ]);
  };

  const openMap = (address: string | number | boolean) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={require('../../../assets/img/WorkShops/ws1.png')} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.workshopName}</Text>
        <Text style={styles.subtitle}>{item.specificArea}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => deleteWorkshop(item.id)} style={{ flexDirection: 'row', flex: 1, alignContent: 'center', alignItems: 'center' }}>
            <Icon name="delete" size={30} color="#ff0000" />
            <Text>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openMap(item.address)} style={{ flexDirection: 'row', flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Icon name="map" size={30} color="#4285F4" />
            <Text>View Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Workshop List</Text>
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

export default WorkshopListAdmin;