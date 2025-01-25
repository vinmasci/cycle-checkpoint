import '@testing-library/jest-native/extend-expect';
import { LogBox } from 'react-native';

// Silence RN's warnings
LogBox.ignoreLogs(['[react-native-gesture-handler]']);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  onValue: jest.fn(),
  push: jest.fn(),
  update: jest.fn(),
  off: jest.fn(),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
}));