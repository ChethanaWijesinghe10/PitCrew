import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const UserProfile2: React.FC = () => {
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [nic, setNIC] = useState('');

  // Use effect to fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'username' with the actual user's name or ID to fetch data
        const doc = await firebase.firestore().collection('Users').doc('Kalindusk').get();
        if (doc.exists) {
          const data = doc.data();
          setName(data?.name ?? '');
          setEmail(data?.email ?? '');
          setMobile(data?.mobile ?? '');
          setNIC(data?.nic ?? '');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (name && email && mobile && nic) {
      try {
        await firebase.firestore().collection('Users').doc(name).set({
          name,
          email,
          mobile,
          nic
        });
        Alert.alert("Success", "Successfully Changed");
        navigation.navigate('userscreen3');
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
        <View style={{ width: '100%', height: 60, backgroundColor: '#11046E', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('userscreen1')} >
            <Icon style={{ marginLeft: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 }} name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: 'center', color: '#fff', fontSize: 25, fontWeight: 'bold', marginTop: 15 }}>Workshop Profile</Text>
        </View>
        <KeyboardAwareScrollView>
          <View style={{ marginTop: 40 }}>
            <Image source={require('../../assets/img/logo.png')} style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 20 }} />
            <View style={styles.form}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={styles.input}
                placeholder="Mobile"
                value={mobile}
                onChangeText={setMobile}
              />
              <Text style={styles.label}>NIC</Text>
              <TextInput
                style={styles.input}
                placeholder="NIC"
                value={nic}
                onChangeText={setNIC}
              />
              <TouchableOpacity onPress={handleSave} activeOpacity={0.5}>
                <View style={{ backgroundColor: '#11046E', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile2;

const styles = StyleSheet.create({
  Container: {
  
    backgroundColor: 'white',
    height: '100%',
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
});
