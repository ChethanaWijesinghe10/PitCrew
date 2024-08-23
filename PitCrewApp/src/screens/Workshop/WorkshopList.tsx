import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import { Icon } from '@rneui/base';

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState<{ id: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    getItems();
  }, [selectedCategory]);

  const getItems = async () => {
    try {
      let query: firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection('Mechanics');

      if (selectedCategory) {
        query = query.where('specificArea', '==', selectedCategory);
      }

      const querySnapshot = await query.get();
      const workshopsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkshops(workshopsData);
    } catch (error) {
      console.error('Error getting workshops:', error);
    }
  };

  const openMap = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const callNumber = (phone: string) => {
    const url = `tel:${phone}`;
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
          <TouchableOpacity onPress={() => openMap(item.address)} style={styles.mapButton}>
            <Text style={styles.mapText}>View Location</Text>
            <Icon name="map" size={30} color="#4285F4" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => callNumber(item.contactNo)}>
          <Text style={styles.telText}>{'Tel No: ' + item.contactNo}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workshops}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={(
          <View style={styles.categoriesContainer}>
            <SegmentedPicker width={175} title={'All'} onPress={() => setSelectedCategory(null)} />
            <SegmentedPicker width={175} title={'Auto Mechanic'} onPress={() => setSelectedCategory('Auto Mechanic')} />
            <SegmentedPicker width={175} title={'A/C Technician'} onPress={() => setSelectedCategory('Air Conditioning Technician')} />
            <SegmentedPicker width={175} title={'Auto Body'} onPress={() => setSelectedCategory('Auto Body')} />
            <SegmentedPicker width={175} title={'Auto Electrician'} onPress={() => setSelectedCategory('Auto Electrician')} />
            <SegmentedPicker width={175} title={'Heavy Vehicle Mechanic'} onPress={() => setSelectedCategory('Heavy Vehicle Mechanic')} />
            <SegmentedPicker width={175} title={'Tire Mechanic'} onPress={() => setSelectedCategory('Tire Mechanic')} />
            <SegmentedPicker width={175} title={'Car Wash'} onPress={() => setSelectedCategory('Car Wash')} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

function SegmentedPicker({ width, title, onPress }: { width: number, title: string, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.segmentedPicker, { width }]}>
      <Text style={styles.segmentedPickerText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: '8%',
    padding: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  segmentedPicker: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 5,
    padding: 10,
  },
  segmentedPickerText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#0B0B0B',
  },
  itemContainer: {
    flexDirection: 'row',
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
    color: 'black',
    marginBottom: 5,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapText: {
    paddingRight: 10,
  },
  telText: {
    paddingRight: 10,
    paddingTop: 10,
    color: '#4285F4',  
  },
});

export default WorkshopList;
