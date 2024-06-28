import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Image } from 'react-native';
import React, { useState } from 'react';
import { Icon } from '@rneui/base';

// Import local images
import enginePreparationImage from '../../assets/img/WorkShops/ws1.png';
import transmissionRepairImage from '../../assets/img/WorkShops/ws1.png';
import brakeSuspensionImage from '../../assets/img/WorkShops/ws1.png';
import tireWheelImage from '../../assets/img/WorkShops/ws1.png';
import paintBodyImage from '../../assets/img/WorkShops/ws1.png';
import TabNavigation from '../navigations/TabNavigation';
import WorkshopNavigation from '../navigations/WorkshopNavigation';

const allWorkshops = [
  {
    id: '1',
    name: 'Engine Preparation Workshop',
    location: '123 Main St, Matara',
    service: 'Engine preparing',
    image: enginePreparationImage
  },
  {
    id: '2',
    name: 'Transmission Repair Shop',
    location: '456 Elm St, Galle',
    service: 'Transmission repair',
    image: transmissionRepairImage
  },
  {
    id: '3',
    name: 'Brake and Suspension Center',
    location: '789 Oak St, Colombo',
    service: 'Brake and suspension service',
    image: brakeSuspensionImage
  },
  {
    id: '4',
    name: 'Tire and Wheel Shop',
    location: '101 Pine St, Manner',
    service: 'Tire and wheel service',
    image: tireWheelImage
  },
  {
    id: '5',
    name: 'Paint and Body Workshop',
    location: '202 Maple St,Jaffna',
    service: 'Paint and body work',
    image: paintBodyImage
  },
  {
    id: '6',
    name: 'General Auto Repair',
    location: '303 Cedar St, Gampaha',
    service: 'General repair',
    image: paintBodyImage
  },
  {
    id: '7',
    name: 'Exhaust and Muffler Shop',
    location: '404 Birch St, Kurunagala',
    service: 'Exhaust repair',
    image: paintBodyImage
  },
  {
    id: '8',
    name: 'Electrical Systems Workshop',
    location: '505 Redwood St, Kandy',
    service: 'Electrical systems',
    image: paintBodyImage
  },
  {
    id: '9',
    name: 'Radiator Repair Shop',
    location: '606 Spruce St, Badulla',
    service: 'Radiator repair',
    image: paintBodyImage
  },
  {
    id: '10',
    name: 'Glass Repair and Replacement',
    location: '707 Fir St, Balangoda',
    service: 'Glass repair',
    image: paintBodyImage
  }
];

const WorkshopList = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredWorkshops, setFilteredWorkshops] = useState(allWorkshops.slice(0, 5));
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredData = allWorkshops.filter(workshop =>
      workshop.location.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredWorkshops(filteredData.length > 5 ? filteredData.slice(0, 5) : filteredData);
  };

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const handleDelete = (id: string) => {
    const updatedWorkshops = filteredWorkshops.filter(workshop => workshop.id !== id);
    setFilteredWorkshops(updatedWorkshops);
  };

  const handleAddToCart = (workshop: any) => {
    // Implement the logic to add the workshop to another page/cart
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuToggle}>
          <Icon style={styles.menuIcon} name="menu" size={35} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>PitCrew</Text>
        <TouchableOpacity>
          <Icon style={styles.cartIcon} name="add-shopping-cart" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="person" size={24} color="white" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="history" size={24} color="white" />
            <Text style={styles.menuText}>Inquiry History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="local-gas-station" size={24} color="white" />
            <Text style={styles.menuText}>Fuel Usage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="chat" size={24} color="white" />
            <Text style={styles.menuText}>Chat bot</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="phone" size={24} color="white" />
            <Text style={styles.menuText}>Contact us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="share" size={24} color="white" />
            <Text style={styles.menuText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="logout" size={24} color="white" />
            <Text style={styles.menuText}>Log out</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Location"
          placeholderTextColor="grey"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredWorkshops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workshopItem}>
            <Image source={item.image} style={styles.workshopImage} />
            <View style={styles.workshopInfo}>
              <Text style={styles.workshopName}>{item.name}</Text>
              <Text style={styles.workshopLocation}>{item.location}</Text>
              <Text style={styles.workshopService}>{item.service}</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity >
                <Icon name="delete" size={30} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddToCart(item)}>
                <Icon name="add-shopping-cart" size={30} color="green" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      

    </View>
  )
}

export default WorkshopList

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
    justifyContent: 'space-between',
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
    marginTop: 10,
  },
  cartIcon: {
    marginTop: 10,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    padding: 10,
    zIndex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 2,
    margin: 20,
  },
  searchIcon: {
    marginLeft: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
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
  workshopLocation: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  workshopService: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
});
