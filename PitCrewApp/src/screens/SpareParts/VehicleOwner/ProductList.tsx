import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation, NavigationProp } from '@react-navigation/native';
import Header from '../common/Header';
import { RootStackParamList } from '../../../navigations/VehicleOwner/SparePartsNavigator';

interface Item {
  id: string;
  data: {
    name: string;
    description: string;
    imageUrl: string;
    discountPrice: number;
    price: number;
    qty: number;
  };
}

const ProductList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  useEffect(() => {
    firestore()
      .collection('items')
      .get()
      .then(querySnapshot => {
        let tempData: Item[] = [];
        querySnapshot.forEach(documentSnapshot => {
          tempData.push({
            id: documentSnapshot.id,
            data: documentSnapshot.data() as Item['data'],
          });
        });
        setItems(tempData);
      });
  }, []);

  useEffect(() => {
    getCartItems();
  }, [isFocused]);

  const getCartItems = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    if (userId) {
      const user = await firestore().collection('VehicleOwners').doc(userId).get();
      setCartCount(user.data()?.cart.length || 0);
    }
  };

  const onAddToCart = async (item: Item) => {
    const userId = await AsyncStorage.getItem('USERID');
    if (userId) {
      const user = await firestore().collection('VehicleOwners').doc(userId).get();
      let tempCart = user.data()?.cart || [];

      const existingItemIndex = tempCart.findIndex((itm: Item) => itm.id === item.id);
      if (existingItemIndex !== -1) {
        tempCart[existingItemIndex].data.qty += 1;
      } else {
        tempCart.push({ ...item, data: { ...item.data, qty: 1 } });
      }

      await firestore().collection('VehicleOwners').doc(userId).update({
        cart: tempCart,
      });
      getCartItems();
    }
  };

  const filteredItems = items.filter(item =>
    item.data.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header
        title="Spare Parts"
        icon={require('../../../../assets/img/SpareParts/cart.png')}
        count={cartCount}
        onClickIcon={() => navigation.navigate('Cart')}
      />
      {/* <Appbar.Header style={{ backgroundColor: '#291D7D' }}>
        <Appbar.Action icon={'menu'} color='#291D7D' />
        <Appbar.Content title='Spare Parts' color='white' style={{ alignItems: 'center', }} />
        <Appbar.Action icon={'cart'} color='white'  onPress={() => navigation.navigate('Cart')} />
      </Appbar.Header> */}

      <View style={styles.searchContainer}>
        <Image source={require('../../../../assets/img/SpareParts/search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>

      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <View style={styles.itemView}>
            <Image source={{ uri: item.data.imageUrl }} style={styles.itemImage} />
            <View style={styles.nameView}>
              <Text style={styles.nameText}>{item.data.name}</Text>
              <Text style={styles.descText}>{item.data.description}</Text>
              <View style={styles.priceView}>
                <Text style={styles.priceText}>{'Rs.' + item.data.discountPrice}</Text>
                <Text style={styles.discountText}>{'Rs.' + item.data.price}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.addToCartBtn} onPress={() => onAddToCart(item)}>
              <Text style={{ color: '#fff' }}>Add To Cart</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
    width: '40%',
    margin: 10,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 1,
  },
  descText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 18,
    color: 'red',
    fontWeight: '700',
  },
  discountText: {
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginLeft: 20,
  },
  addToCartBtn: {
    backgroundColor: '#291D7D',
    padding: 10,
    borderRadius: 10,
  },
});

export default ProductList;
