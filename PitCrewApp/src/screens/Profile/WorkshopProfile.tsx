// WorkshopProfile.tsx
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkshopProfile: React.FC = () => {
  const navigation = useNavigation();



  const [workshopName, setWorkshopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [workingCity, setWorkingCity] = useState('');
  const [specialistArea, setSpecialistArea] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('USERID');
            console.log(userId);
      try {
        if (userId) {
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
            setMobile(data.contactNo || '');
            setDescription(data.description || '');
          }
        } else {
          console.log('No such document!');
        }
      }
      } catch (error) {
        console.error('Error fetching document: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} >
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
                value={workshopName}
                onChangeText={setWorkshopName}
                editable={false}
              />
              <Text style={styles.label}>Owner's Name</Text>
              <TextInput
                style={styles.input}
                value={ownerName}
                onChangeText={setOwnerName}
                editable={false}
              />
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                editable={false}
              />
              <Text style={styles.label}>Working City</Text>
              <TextInput
                style={styles.input}
                value={workingCity}
                onChangeText={setWorkingCity}
                editable={false}
              />
              <Text style={styles.label}>Specialist Area</Text>
              <TextInput
                style={styles.input}
                value={specialistArea}
                onChangeText={setSpecialistArea}
                editable={false}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                editable={false}
              />
              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                editable={false}
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                multiline={true}
                numberOfLines={5}
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                editable={false}
              />
              <TouchableOpacity onPress={() => navigation.navigate('EditWorksop' as never)}  activeOpacity={0.5} >
                <View  style={{
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
                  }} >Edit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default WorkshopProfile;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'white'
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
    color:'black'
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
