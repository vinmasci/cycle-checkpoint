import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Banner } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { errorService } from '../../services/error';

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('rider');
  const [loading, setLoading] = useState(false);
  const { signUp, error, clearError } = useAuth();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      return;
    }
    
    try {
      setLoading(true);
      await signUp(email, password);
    } catch (err: any) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Banner
        visible={!!error}
        actions={[
          {
            label: 'Dismiss',
            onPress: clearError,
          },
        ]}
      >
        {error}
      </Banner>

      <Text variant="headlineMedium" style={styles.title}>
        Create Account
      </Text>

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        disabled={loading}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        error={!!error && errorService.isAuthError(error)}
        disabled={loading}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        error={!!error && errorService.isAuthError(error)}
        disabled={loading}
      />

      <SegmentedButtons
        value={role}
        onValueChange={setRole}
        buttons={[
          { value: 'rider', label: 'Rider' },
          { value: 'organizer', label: 'Route Organizer' }
        ]}
        style={styles.segment}
        disabled={loading}
      />

      <Button 
        mode="contained"
        onPress={handleSignUp}
        style={styles.button}
        loading={loading}
        disabled={loading || !email || !password || !name}
      >
        Sign Up
      </Button>

      <Button 
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.link}
        disabled={loading}
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
  link: {
    marginTop: 15,
  },
});