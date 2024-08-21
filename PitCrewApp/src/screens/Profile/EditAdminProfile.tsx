import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase } from '../../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';

const EditAdminProfile: React.FC = () => {
  const navigation = useNavigation();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('USERID');
      try {
        if (userId) {
          const user = await firebase.firestore().collection('Admin').doc(userId).get();

          if (user.exists) {
            const data = user.data();
            if (data) {
              setUserName(data.name || '');
              setEmail(data.email || '');
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


  const handleSave = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    if (userName && email && userId) {
      try {
        await firebase.firestore().collection('Admin').doc(userId).set({
          name: userName,
          email,
        }, { merge: true });
        Alert.alert("Success", "Successfully saved");
        navigation.navigate('userView' as never);
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
        <Appbar.Header style={{ backgroundColor: '#11046E' }}>
          <Appbar.BackAction color='white' onPress={() => navigation.navigate('adminView' as never)} />
          <Appbar.Content title='Edit Profile' color='white' style={{ alignItems: 'center', }} />
          <Appbar.Action icon={'cart'} color='#11046E' />
        </Appbar.Header>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={{ marginTop: 40 }}>
            <Image source={require('../../../assets/img/logo.png')} style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignSelf: 'center',
              marginBottom: 20,
            }} />
            <View style={styles.form}>
              <Text style={styles.label}>Name: </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                placeholderTextColor={'grey'}
                value={userName}
                onChangeText={setUserName}
              />
              <Text style={styles.label}>Email Address: </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor={'grey'}
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity onPress={handleSave} activeOpacity={0.5}>
                <View style={{
                  backgroundColor: '#11046E',
                  padding: 15,
                  borderRadius: 10,
                  marginTop: 40,
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

export default EditAdminProfile;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'white',
    height: '100%'
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
