import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useRoute, RouteProp} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

type RootStackParamList = {
  OrderStatus: {
    status: string;
    userId: string;
    cartList: any[];
    address: string;
    userName: string;
    userEmail: string;
    userMobile: string;
    total: number;
    paymentId: string;
  };
};

type OrderStatusRouteProp = RouteProp<RootStackParamList, 'OrderStatus'>;

interface OrderStatusProps {
  navigation: any;
}

const OrderStatus: React.FC<OrderStatusProps> = ({navigation}) => {
  const route = useRoute<OrderStatusRouteProp>();

  useEffect(() => {
    if (route.params.status === 'success') {
      placeOrder();
    }
  }, []);

  const placeOrder = async () => {
    const userId = route.params.userId;
    const userDoc = await firestore().collection('VehicleOwners').doc(userId).get();
    const userData = userDoc.data();

    if (userData) {
      const tempOrders = userData.orders || [];
      tempOrders.push({
        items: route.params.cartList,
        address: route.params.address,
        orderBy: route.params.userName,
        userEmail: route.params.userEmail,
        userMobile: route.params.userMobile,
        userId: route.params.userId,
        orderTotal: route.params.total,
        paymentId: route.params.paymentId,
      });

      await firestore().collection('VehicleOwners').doc(userId).update({
        cart: [],
        orders: tempOrders,
      });

      await firestore().collection('orders').add({
        items: route.params.cartList,
        address: route.params.address,
        orderBy: route.params.userName,
        userEmail: route.params.userEmail,
        userMobile: route.params.userMobile,
        userId: route.params.userId,
        orderTotal: route.params.total,
        paymentId: route.params.paymentId,
        orderByUserId: userId,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={
          route.params.status === 'success'
            ? require('../../../../assets/img/SpareParts/success.gif')
            : {uri: 'https://png.pngtree.com/png-clipart/20230925/original/pngtree-exclamation-mark-icon-failure-alert-careful-vector-png-image_12684634.png'}
        }
        style={styles.icon}
      />
      <Text style={styles.msg}>
        {route.params.status === 'success'
          ? 'Order Placed Successfully !!'
          : 'Order Failed !!'}
      </Text>
      <TouchableOpacity
        style={styles.backToHome}
        onPress={() => {
          navigation.navigate('Checkout');
        }}
      >
        <Text style={{color: 'white'}}>Go To Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '70%',
    height: '40%',
    alignSelf: 'center',
  },
  msg: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 20
  },
  backToHome: {
    width: '50%',
    height: 50,
    borderWidth: 0.5,
    marginTop: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#291D7D'
  },
});
