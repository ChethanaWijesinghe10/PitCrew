import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Image } from 'react-native';
import React, { useState } from 'react';
import { Icon } from '@rneui/base';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

// Import local images
import enginePreparationImage from '../../assets/img/WorkShops/ws1.png';
import transmissionRepairImage from '../../assets/img/WorkShops/ws1.png';
import brakeSuspensionImage from '../../assets/img/WorkShops/ws1.png';
import tireWheelImage from '../../assets/img/WorkShops/ws1.png';
import paintBodyImage from '../../assets/img/WorkShops/ws1.png';

const allWorkshops = [
  {
    id: '1',
    name: 'Engine Preparation Workshop',
    location: '123 Main St, Matara',
    service: 'Engine preparing',
    image: enginePreparationImage,
    description: 'Specializes in preparing and overhauling engines to ensure optimal performance for various vehicle types.'
  },
  {
    id: '2',
    name: 'Transmission Repair Shop',
    location: '456 Elm St, Galle',
    service: 'Transmission repair',
    image: transmissionRepairImage,
    description: 'Offers expert services in repairing and maintaining transmission systems for smooth and efficient vehicle operation.'
  },
  {
    id: '3',
    name: 'Brake and Suspension Center',
    location: '789 Oak St, Colombo',
    service: 'Brake and suspension service',
    image: brakeSuspensionImage,
    description: 'Provides specialized services in brake and suspension systems to ensure safety and comfort on the road.'
  },
  {
    id: '4',
    name: 'Tire and Wheel Shop',
    location: '101 Pine St, Mannar',
    service: 'Tire and wheel service',
    image: tireWheelImage,
    description: 'Expert in tire and wheel services, offering everything from tire replacements to wheel alignment and balancing.'
  },
  {
    id: '5',
    name: 'Paint and Body Workshop',
    location: '202 Maple St, Jaffna',
    service: 'Paint and body work',
    image: paintBodyImage,
    description: 'Specializes in vehicle painting and bodywork, providing top-quality finishes and repairs for all types of vehicles.'
  },
  {
    id: '6',
    name: 'General Auto Repair',
    location: '303 Cedar St, Gampaha',
    service: 'General repair',
    image: paintBodyImage,
    description: 'A comprehensive auto repair shop offering a wide range of general repair services for vehicles of all makes and models.'
  },
  {
    id: '7',
    name: 'Exhaust and Muffler Shop',
    location: '404 Birch St, Kurunegala',
    service: 'Exhaust repair',
    image: paintBodyImage,
    description: 'Specializes in exhaust and muffler repairs, ensuring your vehicle runs smoothly and efficiently with reduced emissions.'
  },
  {
    id: '8',
    name: 'Electrical Systems Workshop',
    location: '505 Redwood St, Kandy',
    service: 'Electrical systems',
    image: paintBodyImage,
    description: 'Expert in diagnosing and repairing electrical systems, from wiring issues to battery replacements and everything in between.'
  },
  {
    id: '9',
    name: 'Radiator Repair Shop',
    location: '606 Spruce St, Badulla',
    service: 'Radiator repair',
    image: paintBodyImage,
    description: 'Provides specialized radiator repair services to keep your vehicle’s cooling system in top condition.'
  },
  {
    id: '10',
    name: 'Glass Repair and Replacement',
    location: '707 Fir St, Balangoda',
    service: 'Glass repair',
    image: paintBodyImage,
    description: 'Offers glass repair and replacement services, ensuring clear visibility and safety with high-quality materials.'
  }
];


const WorkshopList = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredWorkshops, setFilteredWorkshops] = useState(allWorkshops.slice(0, 5));
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation(); // Initialize useNavigation

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

 

  const handleWorkshopPress = (workshop: any) => {
    navigation.navigate('WorkshopDetails', { workshop });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuToggle}>
          <Icon style={styles.menuIcon} name="menu" size={35} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>PitCrew</Text>
       
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
          <TouchableOpacity style={styles.workshopItem} onPress={() => handleWorkshopPress(item)}>
            <Image source={item.image} style={styles.workshopImage} />
            <View style={styles.workshopInfo}>
              <Text style={styles.workshopName}>{item.name}</Text>
              <Text style={styles.workshopLocation}>{item.location}</Text>
              <Text style={styles.workshopService}>{item.service}</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Icon name="delete" size={30} color="red" />
              </TouchableOpacity>
             
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default WorkshopList;

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
    // justifyContent: 'space-between',
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
    marginLeft: 'auto',
    marginRight: 'auto',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  workshopImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  workshopInfo: {
    flex: 1,
    marginLeft: 10,
  },
  workshopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workshopLocation: {
    fontSize: 14,
    color: 'gray',
  },
  workshopService: {
    fontSize: 14,
    color: 'black',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
