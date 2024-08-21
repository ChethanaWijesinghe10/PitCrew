import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import WorkshopProfile1 from '../../screens/Profile/WorkshopProfile';
import WorkshopProfile from '../../screens/Profile/EditWorkshopProfile';
import UserProfile from '../../screens/Profile/UserProfile';
import EditUserProfile from '../../screens/Profile/EditUserProfile';

export default function UserProfileNavigation() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen name="userView" component={UserProfile} options={{ headerShown: false }} />
            <Stack.Screen name="editUser" component={EditUserProfile} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
