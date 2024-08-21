// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import Items from '../../screens/SpareParts/Mechanic/Items';
import EditItem from '../../screens/SpareParts/Mechanic/EditItem';
import Add from '../../screens/SpareParts/Mechanic/Add';
import MechanicFunctions from '../../screens/SpareParts/Mechanic/MechanicFunctions';
import ProductList from '../../screens/SpareParts/VehicleOwner/ProductList';

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
        <Stack.Screen name="MechanicFunctions" component={MechanicFunctions} />
        <Stack.Screen name="Items" component={Items} />
        <Stack.Screen name="EditItem" component={EditItem} />
        <Stack.Screen name="Add" component={Add} />
        <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SparePartsNavigatorMec;

