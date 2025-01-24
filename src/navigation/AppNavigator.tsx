import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import OrganizerDashboard from '../screens/organizer/OrganizerDashboard';
import CreateRideScreen from '../screens/organizer/CreateRideScreen';
import TrackRideScreen from '../screens/organizer/TrackRideScreen';
import RiderDashboard from '../screens/rider/RiderDashboard';
import RideDetailsScreen from '../screens/RideDetailsScreen';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function OrganizerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={OrganizerDashboard} />
      <Stack.Screen name="CreateRide" component={CreateRideScreen} options={{ title: 'Create Ride' }} />
      <Stack.Screen name="TrackRide" component={TrackRideScreen} options={{ title: 'Track Ride' }} />
      <Stack.Screen name="RideDetails" component={RideDetailsScreen} options={{ title: 'Ride Details' }} />
    </Stack.Navigator>
  );
}

function RiderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={RiderDashboard} />
      <Stack.Screen name="RideDetails" component={RideDetailsScreen} options={{ title: 'Ride Details' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === 'organizer' ? (
        <OrganizerStack />
      ) : (
        <RiderStack />
      )}
    </NavigationContainer>
  );
}