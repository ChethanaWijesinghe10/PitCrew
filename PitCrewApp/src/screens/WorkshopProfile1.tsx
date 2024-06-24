// WorkshopProfile.tsx
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import WorkshopNavigation from '../navigations/WorkshopNavigation';

const WorkshopProfile1: React.FC = () => {
  const navigation = useNavigation();



  const [workshopName, setWorkshopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [workingCity, setWorkingCity] = useState('');
  const [specialistArea, setSpecialistArea] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await firebase.firestore().collection('Workshops').doc('Malshan').get();
        if (doc.exists) {
          const data = doc.data();
          if (data) {
            setWorkshopName(data.workshopName || '');
            setOwnerName(data.ownerName || '');
            setAddress(data.address || '');
            setWorkingCity(data.workingCity || '');
            setSpecialistArea(data.specialistArea || '');
            setEmail(data.email || '');
            setMobile(data.mobile || '');
          }
        } else {
          console.log('No such document!');
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
        <View style={{ width: '100%', height: 60, backgroundColor: '#11046E', flexDirection: 'row' }}>
          <TouchableOpacity>
            <Icon style={{ marginLeft: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 }} name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{
            flex: 1,
            textAlign: 'center',
            color: '#fff',
            fontSize: 25,
            fontWeight: 'bold',
            marginTop: 15
          }}>Workshop Profile</Text>
        </View>
        <KeyboardAwareScrollView>
          <View style={{ marginTop: 40 }}>
            <Image source={require('../../assets/img/logo.png')} style={{
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
                value={workshopName}
                onChangeText={setWorkshopName}
                editable={false}
              />
              <Text style={styles.label}>Owner's Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={ownerName}
                onChangeText={setOwnerName}
                editable={false}
              />
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Main St"
                value={address}
                onChangeText={setAddress}
                editable={false}
              />
              <Text style={styles.label}>Working City</Text>
              <TextInput
                style={styles.input}
                placeholder="New York"
                value={workingCity}
                onChangeText={setWorkingCity}
                editable={false}
              />
              <Text style={styles.label}>Specialist Area</Text>
              <TextInput
                style={styles.input}
                placeholder="Engine Repair"
                value={specialistArea}
                onChangeText={setSpecialistArea}
                editable={false}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="example@example.com"
                value={email}
                onChangeText={setEmail}
                editable={false}
              />
              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={styles.input}
                placeholder="123-456-7890"
                value={mobile}
                onChangeText={setMobile}
                editable={false}
              />
              <TouchableOpacity onPress={() => navigation.navigate('workshopscreen2')}  activeOpacity={0.5} >
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

export default WorkshopProfile1;

const styles = StyleSheet.create({
  Container: {
    marginBottom: 150
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
