import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ref, onValue, push } from 'firebase/database';
import * as Location from 'expo-location';
import RideDetailsScreen from '../RideDetailsScreen';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext');
jest.mock('firebase/database');
jest.mock('expo-location');

const mockUser = { id: 'user123', email: 'test@example.com' };
const mockRide = {
  id: 'ride123',
  title: 'Test Ride',
  date: '2025-02-01',
  checkpoints: [
    {
      id: 'cp1',
      name: 'Checkpoint 1',
      location: { latitude: 37.78825, longitude: -122.4324 },
      radiusMeters: 50
    }
  ]
};

describe('RideDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 37.78825, longitude: -122.4324 }
    });
  });

  it('renders ride details', async () => {
    (ref as jest.Mock).mockReturnValue('mockedRef');
    (onValue as jest.Mock).mockImplementation((_, callback) => {
      callback({
        exists: () => true,
        val: () => mockRide
      });
      return jest.fn();
    });

    const { getByText } = render(
      <RideDetailsScreen route={{ params: { rideId: 'ride123' } }} />
    );

    await waitFor(() => {
      expect(getByText('Test Ride')).toBeTruthy();
      expect(getByText('Checkpoint 1')).toBeTruthy();
    });
  });

  it('handles check-ins when in range', async () => {
    (ref as jest.Mock).mockReturnValue('mockedRef');
    (onValue as jest.Mock).mockImplementation((_, callback) => {
      callback({
        exists: () => true,
        val: () => mockRide
      });
      return jest.fn();
    });
    (push as jest.Mock).mockResolvedValue({ key: 'checkin123' });

    const { getByText } = render(
      <RideDetailsScreen route={{ params: { rideId: 'ride123' } }} />
    );

    await waitFor(() => {
      const checkInButton = getByText('Check In');
      fireEvent.press(checkInButton);
      expect(push).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          riderId: mockUser.id,
          location: expect.any(Object)
        })
      );
    });
  });

  it('requests location permissions', async () => {
    render(
      <RideDetailsScreen route={{ params: { rideId: 'ride123' } }} />
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
    });
  });
});