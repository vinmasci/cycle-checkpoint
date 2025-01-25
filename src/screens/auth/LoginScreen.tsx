import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Banner } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { errorService } from '../../services/error';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, error, clearError } = useAuth();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
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
        Cycle Checkpoint
      </Text>

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

      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.button}
        loading={loading}
        disabled={loading || !email || !password}
      >
        Login
      </Button>

      <Button 
        mode="text" 
        onPress={() => navigation.navigate('SignUp')}
        style={styles.link}
        disabled={loading}
      >
        Create Account
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
  button: {
    marginTop: 10,
    padding: 5,
  },
  link: {
    marginTop: 15,
  },
});