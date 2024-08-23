import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useIsFocused, useNavigation, NavigationProp } from '@react-navigation/native';
import firestore, { Filter, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ItemData {
  id: string;
  data: FirebaseFirestoreTypes.DocumentData;
}

const Items: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <ItemList />
      </ScrollView>
    </View>
  );
};

const ItemList: React.FC = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<any>>();
  const [items, setItems] = useState<ItemData[]>([]);

  useEffect(() => {
    if (isFocused) {
      getItems();
    }
  }, [isFocused]);

  const getItems = async () => {

    try {
      const uid = await AsyncStorage.getItem('USERID')

      if (!uid) {
        console.error('User ID not found in AsyncStorage');
        return;
      }

      const querySnapshot = await firestore()
        .collection('items')
        .where('mecId', '==', uid)
        .get();

      console.log('Total items: ', querySnapshot.size);
      const tempData: ItemData[] = [];
      querySnapshot.forEach(documentSnapshot => {
        console.log('Item ID: ', documentSnapshot.id, documentSnapshot.data());
        tempData.push({
          id: documentSnapshot.id,
          data: documentSnapshot.data(),
        });
      });
      setItems(tempData);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const deleteItem = (docId: string) => {
    firestore()
      .collection('items')
      .doc(docId)
      .delete()
      .then(() => {
        console.log('Item deleted!');
        getItems();
      });
  };

  return (
    <View>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../../assets/img/SpareParts/arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Product List</Text>
      </View> */}
      <Appbar.Header style={{ backgroundColor: '#291D7D' }}>
        <Appbar.BackAction color='white' onPress={() => navigation.navigate('MechanicFunctions')} />
        <Appbar.Content title='Product List' color='white' style={{ alignItems: 'center', }} />
        <Appbar.Action icon={'cart'} color='#291D7D' />
      </Appbar.Header>
      {items.map(item => (
        <View key={item.id} style={styles.itemView}>
          <Image source={{ uri: item.data.imageUrl }} style={styles.itemImage} onError={() => console.log('Error loading image')} />
          <View style={styles.nameView}>
            <Text style={styles.nameText}>{item.data.name}</Text>
            <Text style={styles.descText}>{item.data.description}</Text>
            <View style={styles.priceView}>
              <Text style={styles.priceText}>{'Rs.' + item.data.discountPrice}</Text>
              <Text style={styles.discountText}>{'Rs.' + item.data.price}</Text>
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditItem', {
                  data: item.data,
                  id: item.id,
                });
              }}>
              <Image source={require('../../../../assets/img/SpareParts/edit.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Image source={require('../../../../assets/img/SpareParts/delete.png')} style={[styles.icon, { marginTop: 20 }]} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#291D7D',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
    width: '53%',
    margin: 10,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
  },
  descText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 18,
    color: 'red',
    fontWeight: '700',
    paddingRight: 20
  },
  discountText: {
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Items;
