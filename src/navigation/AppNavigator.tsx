import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Auth Screens (to be created)
const LoginScreen = () => null;
const SignUpScreen = () => null;
const RoleSelectScreen = () => null;

// Main Screens (to be created)
const OrganizerDashboard = () => null;
const RiderDashboard = () => null;

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
    </Stack.Navigator>
  );
}

function OrganizerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={OrganizerDashboard} />
    </Stack.Navigator>
  );
}

function RiderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={RiderDashboard} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Show loading screen
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