import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from '../../screens/Profile/UserProfile';
import EditUserProfile from '../../screens/Profile/EditUserProfile';
import AdminProfile from '../../screens/Profile/AdminProfile';
import EditAdminProfile from '../../screens/Profile/EditAdminProfile';

export default function AdminProfileNavigation() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen name="adminView" component={AdminProfile} options={{ headerShown: false }} />
            <Stack.Screen name="editAdmin" component={EditAdminProfile} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
