import { StyleSheet, Text, TouchableOpacity, View, Image, Linking, Alert, Platform } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from '@rneui/base';

const WorkshopDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workshop } = route.params;

  const openLocation = (address: string | number | boolean) => {
    const query = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`
    });

    Linking.openURL(url).catch(err => Alert.alert('Error', 'Unable to open the location.'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('WorkshopList' as never)}>
          <Icon style={styles.menuIcon} name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{workshop.name}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <Image source={workshop.image} style={styles.image} />
        <Text style={styles.title}>{workshop.name}</Text>
        <Text style={styles.description}>{workshop.description}</Text>
        <TouchableOpacity style={styles.locationContainer} onPress={() => openLocation(workshop.location)}>
          <Icon name="location-pin" size={30} color="red" />
          <Text style={styles.location}>{workshop.location}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkshopDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight:'600'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    fontSize: 18,
    color: 'black',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

