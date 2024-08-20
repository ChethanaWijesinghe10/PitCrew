import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';

const EditWorkshopProfile: React.FC = () => {
  const navigation = useNavigation();

  const [workshopName, setWorkshopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [workingCity, setWorkingCity] = useState('');
  const [specialistArea, setSpecialistArea] = useState('');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('USERID');
      if (userId) {
        try {
          const user = await firebase.firestore().collection('Mechanics').doc(userId).get();
          if (user.exists) {
            const data = user.data();
            if (data) {
              setWorkshopName(data.worshopName || '');
              setOwnerName(data.ownerName || '');
              setAddress(data.address || '');
              setWorkingCity(data.workingCity || '');
              setSpecialistArea(data.specificArea || '');
              setEmail(data.email || '');
              setContactNo(data.contactNo || '');
              setDescription(data.description || '');
            }
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document: ', error);
        }
      }
    };

    fetchData();
  }, []);


  const handleSave = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    if (workshopName && ownerName && address && workingCity && specialistArea && email && contactNo && description && userId) {
      try {
        await firebase.firestore().collection('Mechanics').doc(userId).set({
          workshopName,
          ownerName,
          address,
          workingCity,
          specificArea: specialistArea,
          email,
          contactNo,
          description
        }, { merge: true });
        Alert.alert("Success", "Successfully saved");
        navigation.navigate('workshopscreen' as never);
      } catch (error) {
        console.error("Error saving document: ", error);
        Alert.alert("Error", "Please try again");
      }
    } else {
      Alert.alert("Error", "All fields are required");
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.Container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} >
        <Appbar.Header style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction color='black' onPress={() => navigation.navigate('workshopscreen' as never)} />
          <Appbar.Content title='Workshop Profile' color='black' style={{ alignItems: 'center', }} />
          <Appbar.Action icon={'cart'} color='white' />
        </Appbar.Header>
          <View style={{ marginTop: 40 }}>
            <Image source={require('../../../assets/img/logo.png')} style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignSelf: 'center',
              marginBottom: 20,
            }} />
            <View style={styles.form}>
              <Text style={styles.label}>Workshop Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Mohammed Auto"
                placeholderTextColor={'grey'}
                value={workshopName}
                onChangeText={setWorkshopName}
              />
              <Text style={styles.label}>Owner's Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={'grey'}
                value={ownerName}
                onChangeText={setOwnerName}
              />
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Main St"
                placeholderTextColor={'grey'}
                value={address}
                onChangeText={setAddress}
              />
              <Text style={styles.label}>Working City</Text>
              <TextInput
                style={styles.input}
                placeholder="New York"
                placeholderTextColor={'grey'}
                value={workingCity}
                onChangeText={setWorkingCity}
              />
              <Text style={styles.label}>Specialist Area</Text>
              <TextInput
                style={styles.input}
                placeholder="Engine Repair"
                placeholderTextColor={'grey'}
                value={specialistArea}
                onChangeText={setSpecialistArea}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="example@example.com"
                placeholderTextColor={'grey'}
                value={email}
                onChangeText={setEmail}
              />
              <Text style={styles.label}>Contact No</Text>
              <TextInput
                style={styles.input}
                placeholder="123-456-7890"
                placeholderTextColor={'grey'}
                value={contactNo}
                onChangeText={setContactNo}
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                multiline={true}
                numberOfLines={4}
                placeholder="Enter a description"
                placeholderTextColor={'grey'}
                value={description}
                onChangeText={setDescription}
              />
              <TouchableOpacity onPress={handleSave} activeOpacity={0.5}>
                <View style={{
                  backgroundColor: '#11046E',
                  padding: 15,
                  borderRadius: 10,
                  marginTop: 20,
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditWorkshopProfile;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'white'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    color: 'black'
  },
  form: {
    padding: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
