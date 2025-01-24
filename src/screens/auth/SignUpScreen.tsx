import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('rider');
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      await signUp(email, password);
      // Role and name will be saved in Firebase after auth
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create Account
      </Text>

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
      />

      <SegmentedButtons
        value={role}
        onValueChange={setRole}
        buttons={[
          { value: 'rider', label: 'Rider' },
          { value: 'organizer', label: 'Route Organizer' }
        ]}
        style={styles.segment}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button 
        mode="contained" 
        onPress={handleSignUp} 
        style={styles.button}
      >
        Sign Up
      </Button>

      <Button 
        mode="text" 
        onPress={() => navigation.navigate('Login')}
        style={styles.link}
      >
        Already have an account? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  segment: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    padding: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  link: {
    marginTop: 15,
  },
});