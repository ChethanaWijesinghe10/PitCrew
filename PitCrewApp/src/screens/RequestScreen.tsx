import { StyleSheet, View } from 'react-native';
import React from 'react';

const RequestScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardCol}>
        <View style={styles.cardRow}>
          <View style={styles.card}></View>
          <View style={styles.card}></View>
          <View style={styles.card}></View>
        </View>
        <View style={styles.cardRow}>
          <View style={styles.card}></View>
          <View style={styles.card}></View>
          <View style={styles.card}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start', 
    paddingTop: '5%', 
  },
  cardCol: {
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10, 
  },
  card: {
    width: 100,
    height: 50, 
    backgroundColor: 'red',
  },
});

export default RequestScreen;
