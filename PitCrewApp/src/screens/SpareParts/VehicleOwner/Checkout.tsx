import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { useStripe, CardField, initStripe } from '@stripe/stripe-react-native';
import { Appbar } from 'react-native-paper';

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
  const stripe = useStripe();

  useEffect(() => {
    initStripe({ publishableKey: 'pk_test_51PJZWwG5nxL6dlBMLgFfy3VqsNNLUmfp31gyDKy3RqpKFfV5yzhcJpwjuoENu0ImWtkFbCyEOEZ8semA6hA3pyJP00bTGnIfOA' });
    getCartItems();
    getAddressList();
  }, [isFocused]);

  // Function to get cart items from Firestore
  const getCartItems = async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID') ?? '';
      const userDoc = await firestore().collection('VehicleOwners').doc(userId).get();
      const userData = userDoc.data();
      if (userData && userData.cart) {
        setCartList(userData.cart);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Function to get user's address list from Firestore
  const getAddressList = async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID') ?? '';
      const addressId = await AsyncStorage.getItem('ADDRESS') ?? '';
      const userDoc = await firestore().collection('VehicleOwners').doc(userId).get();
      const userData = userDoc.data();
      if (userData && userData.address) {
        const address = userData.address.find((item: { addressId: string }) => item.addressId === addressId);
        if (address) {
          setSelectedAddress(`${address.street}, ${address.city}, ${address.pincode}, ${address.mobile}`);
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Function to calculate total price of items in cart
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

  // Function to create payment intent
  const createPaymentIntent = async () => {
    try {
      const totalAmount = getTotal() * 100; // Convert to cents
      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  // Function to handle payment process
  const handlePayment = async () => {
    try {
      const clientSecret = await createPaymentIntent();
      const { error, paymentIntent } = await stripe.confirmPayment(clientSecret);

      if (error) {
        console.error('Payment failed', error);
        Alert.alert('Payment failed', error.message);
        navigation.navigate('OrderStatus', { status: 'failed' });
      } else if (paymentIntent) {
        Alert.alert('Payment successful', 'Your payment was successful');
        navigation.navigate('OrderStatus', {
          status: 'success',
          paymentId: paymentIntent.id,
          cartList: cartList,
          total: getTotal(),
          address: selectedAddress,
        });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Payment failed', 'There was an error processing your payment');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Appbar.Header style={{ backgroundColor: '#291D7D' }}>
          <Appbar.BackAction color='white' onPress={() => navigation.navigate('ProductList')} />
          <Appbar.Content title='Checkout' color='white' style={{ alignItems: 'center' }} />
          <Appbar.Action icon={'cart'} color='#291D7D' />
        </Appbar.Header>

        <FlatList
          style={{ flexGrow: 1 }}
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
        />

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

      

      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={styles.cardField}
        onCardChange={(cardDetails: any) => {
          console.log('cardDetails', cardDetails);
        }}
        onFocus={(focusedField: any) => {
          console.log('focusField', focusedField);
        }}
      />

      <View>
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
              handlePayment();
            }
          }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
            Pay Now {'$' + getTotal()}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  icon: {
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
    height: 230,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  nameView: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  discountText: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#666',
    marginLeft: 10,
  },
  totalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
  },
  editAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
  cardField: {
    width: '95%',
    height: 50,
    marginVertical: 30,
    marginHorizontal: 10,
  },
  checkoutBtn: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
});
