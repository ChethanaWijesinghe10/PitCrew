import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import { Icon } from '@rneui/base';

interface CartItem {
  id: string;
  data: {
    name: string;
    description: string;
    imageUrl: string;
    discountPrice: number;
    price: number;
  };
  qty?: number;
}

const Checkout: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [cartList, setCartList] = useState<CartItem[]>([]);
  const isFocused = useIsFocused();
  const [selectedAddress, setSelectedAddress] = useState<string>('No Selected Address');

  useEffect(() => {
    getCartItems();
    getAddressList();
  }, [isFocused]);

  const getCartItems = async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID') ?? ''; // Handle null
      const userDoc = await firestore().collection('VehicleOwners').doc(userId).get();
      const userData = userDoc.data();
      if (userData && userData.cart) {
        setCartList(userData.cart);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const getAddressList = async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID') ?? ''; // Handle null
      const addressId = await AsyncStorage.getItem('ADDRESS') ?? ''; // Handle null
      const userDoc = await firestore().collection('VehicleOwners').doc(userId).get();
      const userData = userDoc.data();
      if (userData && userData.address) {
        const address = userData.address.find((item: { addressId: string; }) => item.addressId === addressId);
        if (address) {
          setSelectedAddress(`${address.street}, ${address.city}, ${address.pincode}, ${address.mobile}`);
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const getTotal = () => {
    return cartList.reduce((total, item) => {
      const itemPrice = parseFloat(item.data.discountPrice.toString());
      const itemQuantity = item.qty !== undefined ? parseFloat(item.qty.toString()) : 1;
      if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
        return total + (itemPrice * itemQuantity);
      } else {
        return total;
      }
    }, 0);
  };

  const payNow = async () => {
    try {
      const email = await AsyncStorage.getItem('EMAIL') ?? ''; // Handle null
      const name = await AsyncStorage.getItem('NAME') ?? ''; // Handle null
      const mobile = await AsyncStorage.getItem('MOBILE') ?? ''; // Handle null
      const userId = await AsyncStorage.getItem('USERID') ?? ''; // Handle null
      const options = {
        description: 'Credits towards consultation',
        image: require('../../../../assets/img/logo.png'), // Correct image path
        currency: 'INR',
        key: 'rzp_test_2VYHup8J177yIx',
        amount: getTotal() * 100,
        name: 'Food App',
        order_id: '', // Replace this with an order_id created using Orders API.
        prefill: {
          email: email,
          contact: mobile,
          name: name,
        },
        theme: { color: '#EC9912' },
      };
      RazorpayCheckout.open(options)
        .then((data: { razorpay_payment_id: any; }) => {
          navigation.navigate('OrderStatus', {
            status: 'success',
            paymentId: data.razorpay_payment_id,
            cartList: cartList,
            total: getTotal(),
            address: selectedAddress,
            userId: userId,
            userName: name,
            userEmail: email,
            userMobile: mobile,
          });
        })
        .catch((error: any) => {
          console.error('Payment error:', error);
          navigation.navigate('OrderStatus', {
            status: 'failed',
          });
        });
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.container}
        data={cartList}
        renderItem={({ item, index }) => {
          const qty = item.qty !== undefined ? item.qty : 1;
          return (
            <View style={styles.itemView}>
              <Image
                source={{ uri: item.data.imageUrl }}
                style={styles.itemImage}
              />
              <View style={styles.nameView}>
                <Text style={styles.nameText}>{item.data.name}</Text>
                <Text style={styles.descText}>{item.data.description}</Text>
                <View style={styles.priceView}>
                  <Text style={styles.priceText}>
                    {'$' + item.data.discountPrice}
                  </Text>
                  <Text style={styles.discountText}>
                    {'$' + item.data.price}
                  </Text>
                </View>
              </View>
              <Text style={styles.nameText}>{'Qty : ' + qty}</Text>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <View style={styles.header}>
            <Icon type='ionicons' name='arrow-back' color={'white'} onPress={() => navigation.navigate('Cart')} />
            <Text style={{ flex: 1, textAlign: 'center', color: 'white', fontSize: 20, fontWeight: '500' }}>Checkout</Text>
          </View>
        }
        ListFooterComponent={
          <View>
            <View style={styles.totalView}>
              <Text style={styles.nameText}>Total</Text>
              <Text style={styles.nameText}>{'$' + getTotal()}</Text>
            </View>
            <View style={styles.totalView}>
              <Text style={styles.nameText}>Selected Address</Text>
              <Text
                style={styles.editAddress}
                onPress={() => {
                  navigation.navigate('Address');
                }}>
                Change Address
              </Text>
            </View>
            <Text
              style={{
                margin: 15,
                width: '100%',
                fontSize: 16,
                color: '#000',
                fontWeight: '600',
              }}>
              {selectedAddress}
            </Text>
            <TouchableOpacity
              disabled={selectedAddress === 'No Selected Address'}
              style={[
                styles.checkoutBtn,
                {
                  backgroundColor:
                    selectedAddress === 'No Selected Address' ? '#DADADA' : 'green',
                },
              ]}
              onPress={() => {
                if (selectedAddress !== 'No Selected Address') {
                  payNow();
                }
              }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
                Pay Now {'$' + getTotal()}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    alignItems: 'center',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
    width: '50%',
    marginHorizontal: 5,
    marginVertical: 5,
    paddingTop: 0,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
  },
  descText: {
    fontSize: 14,
    fontWeight: '600',
    width: '100%',
  },
  priceText: {
    fontSize: 17,
    color: 'red',
    fontWeight: '700',
  },
  discountText: {
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginLeft: 20,
  },
  totalView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 20,
    height: 50,
    borderTopWidth: 0.3,
    paddingRight: 20,
    marginTop: 20,
    alignItems: 'center',
    borderTopColor: '#8e8e8e',
  },
  editAddress: {
    color: '#2F62D1',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  checkoutBtn: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    backgroundColor: 'green',
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#291D7D',
    height: 60,
    paddingHorizontal: 20,
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
