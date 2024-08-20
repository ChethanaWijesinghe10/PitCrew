// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import ProductList from '../screens/SpareParts/VehicleOwner/ProductList';
import Cart from '../screens/SpareParts/VehicleOwner/Cart';
import Checkout from '../screens/SpareParts/VehicleOwner/Checkout';
import Address from '../screens/SpareParts/VehicleOwner/Address';
import AddNewAddress from '../screens/SpareParts/VehicleOwner/AddNewAddress';
import OrderStatus from '../screens/SpareParts/VehicleOwner/OrderStatus';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
  EditItem: undefined;
  SelectLogin: undefined;
  UserLogin: undefined;
  Home: undefined;
  Cart: undefined;
  UserSignup: undefined;
  Checkout: undefined;
  Address: undefined;
  AddNewAddress: undefined;
  OrderStatus: undefined;
  Profile: undefined;
  Items: undefined;
  MechanicFunctions: undefined;
  Add: undefined;
  Main: undefined;
  ProductList: undefined; // Added ProductList here
};

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
};

const SparePartsNavigatorMec: React.FC = () => {
  return (
    <NavigationContainer independent={true} >
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
        <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
        <Stack.Screen name="Address" component={Address} options={{ headerShown: false }} />
        <Stack.Screen name="AddNewAddress" component={AddNewAddress} options={{ headerShown: false }} />
        <Stack.Screen name="OrderStatus" component={OrderStatus} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SparePartsNavigatorMec;

