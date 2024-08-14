import React, { useState } from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import { sty } from '../styles/Styles'; 
import { Dropdown } from 'react-native-element-dropdown';
import { Appbar, Button } from 'react-native-paper';

const SignupWelcomeScreen = (props: any) => {

  const stack = props.navigation;

  function gotoSignIn() {
    stack.navigate('SignIn');
  }

  const [selectedValue, setSelectedValue] = useState<string>('');

  const dropdownItems = [
    { label: 'Vehicle Owner', value: 'VOwner' },
    { label: 'Mechanic', value: 'Mechanic' },
  ];

  function handleNavigation() {
    if (selectedValue === 'VOwner') {
      stack.navigate('SignUpUser');
    } else if (selectedValue === 'Mechanic') {
      stack.navigate('SignUpMec');
    }
  }

  return (
    <View style={sty.AppContainer}>

      <StatusBar backgroundColor={'#fff'} />

      <Appbar.Header style={{ backgroundColor: 'white' }}>
        <Appbar.BackAction color='#584F9A' style={sty.BackIcon} onPress={() => { stack.navigate('Welcome') }} />
        <Text style={sty.BackWord}>Back</Text>
      </Appbar.Header>

      <Image source={require('../../assets/img/logoWhite.jpg')} style={{ alignSelf: 'center', width: 150, height: 150 }} />
      <Text style={{
        fontFamily: 'Poppins-SemiBold',
        fontSize: 32,
        alignSelf: 'center',
        color: '#11046E',
        fontWeight: '600',
        marginTop: 40
      }}>
        Welcome to PitCrew,
      </Text>
      <Text style={{ alignSelf: 'center', marginTop: 35, color: 'black', fontWeight: '500' }}>
        {'Are you a mechanic or a vehicle owner?\nChoose below to access tailored services'}
      </Text>
      <View style={[sty.TextInputField, { marginTop: 40 }]}>
        <Dropdown
          style={{ width: 310, height: 50, marginLeft: 10, }}
          itemTextStyle={{ color: 'black' }}
          selectedTextStyle={{ color: 'black' }}
          placeholderStyle={{ color: '#B3B3B6' }}
          data={dropdownItems}
          onChange={(item) => setSelectedValue(item.value)}
          value={selectedValue}
          placeholder="Select an option"
          labelField={'label'}
          valueField={'value'}
        />
      </View>
      <Button
        mode='contained'
        style={{
          borderRadius: 10,
          backgroundColor: '#291D7D',
          height: 55,
          justifyContent: 'center',
          marginHorizontal: '7.5%',
          marginTop: '17.5%',
        }}
        onPress={handleNavigation}
      >
        <Text style={{ fontSize: 18 }}>Continue</Text>
      </Button>
      <Text style={{ alignSelf: 'center', marginTop: '8%', color: 'black' }}>
        Existing user?
        <Text style={{ color: '#291D7D', fontWeight: '900' }} onPress={gotoSignIn}> Sign In </Text>here
      </Text>
    </View>
  );
};

export default SignupWelcomeScreen;
