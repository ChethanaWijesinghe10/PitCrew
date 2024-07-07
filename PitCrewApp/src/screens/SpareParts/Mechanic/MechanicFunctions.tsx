import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

//import carMaintainImage from '../../images/carMaintain.png';

type RootStackParamList = {
  SelectLogin: undefined;
  Items: undefined;
  Add: undefined;
};

const MechanicFunctions: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Initialize navigation using useNavigation hook

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowIcon}
          onPress={() => navigation.navigate('SelectLogin')}>
          <Image source={require('../../../../assets/img/SpareParts/arrow.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Hi Mechanics</Text>
      </View> */}
  

      <Image source={require('../../../../assets/img/SpareParts/mechanics.png')} style={styles.pic}/>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Items')}>
        <Text style={styles.btnText}>View/Edit SpareParts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Add')}>
        <Text style={styles.btnText}>Add Spareparts</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MechanicFunctions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#291D7D',
    height: 60,
    paddingLeft: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  arrowIcon: {
    marginRight: 20,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  btn: {
    backgroundColor: '#291D7D',
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  pic: {
    height: 350,
    marginTop: 30,
    width: 430,
    alignSelf:'center'
  }
});
