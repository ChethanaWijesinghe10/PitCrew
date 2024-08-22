import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, PermissionsAndroid, Image, TextInput, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { Icon } from '@rneui/base';
import axios from 'axios';

interface Item {
  id: string;
  data: {
    workshopName: string;
    description: string;
    contactNo: number;
    specificArea: string;
    address: string;
    workingCity: string;
    village: string;
    district: string;
  };
}

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === 'granted';
  } catch (err) {
    return false;
  }
};

const RequestScreen = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilteredItems, setLocationFilteredItems] = useState<Item[]>([]);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [village, setVillage] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [noResults, setNoResults] = useState<boolean>(false);
  const [showReset, setShowReset] = useState<boolean>(false);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await firestore().collection('Mechanics').get();
      let tempData: Item[] = [];
      querySnapshot.forEach(documentSnapshot => {
        tempData.push({
          id: documentSnapshot.id,
          data: documentSnapshot.data() as Item['data'],
        });
      });
      setItems(tempData);
      setLocationFilteredItems(tempData); 
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filteredByLocation = items.filter(item => {
        const itemData = item.data;
        return (village === '' || (itemData.village && itemData.village.toLowerCase() === village.toLowerCase())) ||
               (district === '' || (itemData.district && itemData.district.toLowerCase() === district.toLowerCase()));
      });

      const filteredByText = filteredByLocation.filter(item => {
        const lowerSearchQuery = searchQuery.toLowerCase();
        const itemData = item.data;
        return (
          (itemData.workshopName && itemData.workshopName.toLowerCase().includes(lowerSearchQuery)) ||
          (itemData.description && itemData.description.toLowerCase().includes(lowerSearchQuery)) ||
          (itemData.specificArea && itemData.specificArea.toLowerCase().includes(lowerSearchQuery)) ||
          (itemData.address && itemData.address.toLowerCase().includes(lowerSearchQuery)) ||
          (itemData.workingCity && itemData.workingCity.toLowerCase().includes(lowerSearchQuery))
        );
      });

      setLocationFilteredItems(filteredByText);
      setNoResults(filteredByText.length === 0);
    };

    applyFilters();
  }, [searchQuery, village, district, items]);

  const handleLocationFilter = () => {
    const filteredItems = items.filter(item => {
      const itemData = item.data;
      return (village === '' || (itemData.village && itemData.village.toLowerCase() === village.toLowerCase())) ||
             (district === '' || (itemData.district && itemData.district.toLowerCase() === district.toLowerCase()));
    });
    setLocationFilteredItems(filteredItems);
    setShowReset(true);
    setNoResults(filteredItems.length === 0);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setVillage('');
    setDistrict('');
    setLocationFilteredItems(items);
    setShowReset(false);
    setNoResults(false);
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          reverseGeoCode(latitude, longitude);
        },
        error => {
          console.error(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  const reverseGeoCode = async (latitude: number, longitude: number) => {
    try {
      const dataURL = `https://us1.locationiq.com/v1/reverse?key=pk.65885866a6c94616e70cc7c0f651fbc6&lat=${latitude}&lon=${longitude}&format=json&`;
      const dataResponse = await axios.get(dataURL);
      const locationVillage = dataResponse.data.address.village; 
      const locationDistrict = dataResponse.data.address.state_district;
      setVillage(locationVillage);
      setDistrict(locationDistrict);
      handleLocationFilter(); 
    } catch (error: any) {
      console.error('Error fetching location:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', gap: 10, alignItems: 'center' }} >
        <Image source={require('../../assets/img/locationIcon.png')} style={styles.locationIcon} />
        <View>
          <TextInput
            placeholder='Search'
            style={styles.searchBar}
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
        </View>
        <Image source={require('../../assets/img/placeholder.jpg')} style={styles.userImage} />
      </View>

      <TouchableOpacity onPress={getLocation} activeOpacity={0.7} style={styles.location}>
        <Icon name='location-sharp' type='ionicon' style={{ paddingRight: 5 }} />
        <Text style={{ color: 'black' }}>Find by location</Text>
      </TouchableOpacity>

      {noResults && showReset && (
        <TouchableOpacity onPress={resetFilters} activeOpacity={0.7} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset Filters</Text>
        </TouchableOpacity>
      )}

      <View style={styles.contentContainer}>
        {noResults ? (
          <Text style={styles.noResultsText}>No Results Found</Text>
        ) : (
          <FlatList
            data={locationFilteredItems}
            renderItem={({ item }) => (
              <View style={styles.itemView}>
                <Image source={require('../../assets/img/WorkShops/ws1.png')} style={styles.itemImage} />
                <View style={styles.nameView}>
                  <View style={styles.nameAreaContainer}>
                    <Text style={styles.nameText}>{item.data.workshopName}</Text>
                    <Text style={styles.areaText}>{' - ' + item.data.specificArea}</Text>
                  </View>
                  <Text style={styles.descText}>{item.data.description}</Text>
                  <Text style={styles.descText}>{item.data.address}</Text>
                  <Text style={styles.descText}>{'tel no: ' + item.data.contactNo}</Text>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  locationIcon: {
    width: 50,
    height: 50
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 4,
    borderRadius: 50,
    paddingLeft: 10,
    width: Dimensions.get('screen').width * 0.6
  },
  location: {
    margin: 10,
    backgroundColor: '#e6e6e7',
    width: '45%',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    borderRadius: 20,
    marginTop: 20
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 100
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemView: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#e6e6e7',
    elevation: 4,
    marginTop: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
    padding: 5
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
    width: '70%',
    margin: 10,
  },
  nameAreaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 1,
  },
  areaText: {
    fontSize: 15,
    color: '#555',
  },
  descText: {
    fontSize: 14,
    fontWeight: '600',
    paddingTop: 8
  },
  noResultsText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  resetButton: {
    margin: 10,
    backgroundColor: '#ff6f61',
    width: '50%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});


export default RequestScreen;
