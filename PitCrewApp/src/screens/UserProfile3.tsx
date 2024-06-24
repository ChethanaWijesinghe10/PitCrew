import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SaveSuccessfully: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="checkmark-circle" size={100} color="#4CAF50" />
        <Text style={styles.successText}>Save Successfully!</Text>
        <Text style={styles.message}>Your changes have been saved successfully.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('userscreen1')}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SaveSuccessfully;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
