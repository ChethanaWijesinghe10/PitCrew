import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Appbar } from 'react-native-paper';

interface CartItem {
  id: string;
  data: {
    imageUrl: string;
    name: string;
    description: string;
    price: string;
    discountPrice: string;
  };
  qty: number;
}

interface CartProps {
  navigation: any;
}

const Cart: React.FC<CartProps> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [cartList, setCartList] = useState<CartItem[]>([]);

  useEffect(() => {
    getCartItems();
  }, [isFocused]);

  const getCartItems = async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID');
      if (!userId) return;

      const userDoc = await firestore().collection('VehicleOwners').doc(userId).get();
      const cartItems = userDoc.data()?.cart || [];

      // Ensure qty property is initialized for each item
      const initializedCartItems = cartItems.map((item: CartItem) => ({
        ...item,
        qty: item.qty || 1
      }));

      setCartList(initializedCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const addItem = async (item: CartItem) => {
    const updatedCart = cartList.map(cartItem =>
      cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
    );
    updateCart(updatedCart);
  };

  const removeItem = async (item: CartItem) => {
    const updatedCart = cartList.map(cartItem =>
      cartItem.id === item.id && cartItem.qty > 1 ? { ...cartItem, qty: cartItem.qty - 1 } : cartItem
    );
    updateCart(updatedCart);
  };

  const deleteItem = async (index: number) => {
    const updatedCart = cartList.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  const updateCart = async (updatedCart: CartItem[]) => {
    try {
      const userId = await AsyncStorage.getItem('USERID');
      if (!userId) return;

      await firestore().collection('VehicleOwners').doc(userId).update({ cart: updatedCart });
      getCartItems();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const getTotal = () => {
    return cartList.reduce((total, item) => {
      const itemPrice = parseFloat(item.data.discountPrice);
      const itemQuantity = parseFloat(item.qty.toString());
      if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
        return total + (itemPrice * itemQuantity);
      } else {
        return total;
      }
    }, 0);
  };

  const getTotalItems = () => {
    return cartList.reduce((total, item) => total + item.qty, 0);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
          <Image source={require('../images/arrow.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Go Back</Text>
      </View> */}
      <Appbar.Header style={{ backgroundColor: '#291D7D' }}>
        <Appbar.BackAction color='white' onPress={() => navigation.navigate('ProductList')} />
        <Appbar.Content title='Cart' color='white' style={{ alignItems: 'center', }} />
        <Appbar.Action icon={'cart'} color='#291D7D' onPress={() => navigation.navigate('Cart')} />
      </Appbar.Header>

      <FlatList
        data={cartList}
        renderItem={({ item, index }) => (
          <View style={styles.itemView}>
            <Image source={{ uri: item.data.imageUrl }} style={styles.itemImage} />
            <View style={styles.infoView}>
              <Text style={styles.nameText}>{item.data.name}</Text>
              <Text style={styles.descText}>{item.data.description}</Text>
              <View style={styles.addRemoveView}>
                <TouchableOpacity style={styles.addToCartBtn} onPress={() => removeItem(item)}>
                  <Text style={styles.addRemoveText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity style={styles.addToCartBtn} onPress={() => addItem(item)}>
                  <Text style={styles.addRemoveText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(index)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.priceView}>
                <Text style={styles.priceText}>{'Rs.' + item.data.discountPrice}</Text>
                <Text style={styles.discountText}>{'Rs.' + item.data.price}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {cartList.length > 0 && (
        <View style={styles.checkoutView}>
          <Text style={styles.totalText}>
            {'Items(' + getTotalItems() + ')\nTotal: $' + getTotal()}
          </Text>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 20,
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
  infoView: {
    width: '70%',
  },
  addRemoveView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 10,
    marginVertical: 5
  },
  nameText: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: 'black'
  },
  descText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
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
    marginLeft: 5,
  },
  addToCartBtn: {
    backgroundColor: '#291D7D',
    padding: 10,
    borderRadius: 10,
  },
  addRemoveText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  deleteBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    marginLeft: 50,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  checkoutView: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  totalText: {
    color: '#000',
    fontWeight: '600',
  },
  checkoutBtn: {
    backgroundColor: '#291D7D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#291D7D',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    flex: 1,
  },
  arrowIcon: {
    marginRight: 20,

  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});
