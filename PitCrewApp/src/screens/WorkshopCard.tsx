import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import React, { useState } from 'react';
import { Icon } from '@rneui/base';
import { useNavigation, useRoute } from '@react-navigation/native';

const WorkshopCard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [addedWorkshops, setAddedWorkshops] = useState(route.params?.addedWorkshops || []);

  const handleLocationPress = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    Linking.openURL(url).catch((err) => console.error('Error opening map:', err));
  };

  const handleDelete = (id) => {
    const updatedWorkshops = addedWorkshops.filter(workshop => workshop.id !== id);
    setAddedWorkshops(updatedWorkshops);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('WorkshopList')}>
          <Icon style={styles.menuIcon} name="arrow-back" size={35} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>PitCrew CART</Text>
      </View>
      <FlatList
        data={addedWorkshops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workshopItem}>
            <Image source={item.image} style={styles.workshopImage} />
            <View style={styles.workshopInfo}>
              <Text style={styles.workshopName}>{item.name}</Text>
              <Text style={styles.workshopService}>{item.service}</Text>
              <View style={styles.locationContainer}>
                <Icon name="location-pin" size={20} color="red" />
                <TouchableOpacity onPress={() => handleLocationPress(item.location)}>
                  <Text style={styles.workshopLocation}>{item.location}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteIcon}>
              <Icon name="delete" size={25} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default WorkshopCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#11046E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginTop: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  workshopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    elevation: 2,
  },
  workshopImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  workshopInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  workshopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workshopService: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  workshopLocation: {
    fontSize: 14,
    color: '#1E90FF',
    marginLeft: 5,
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
    marginHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});
