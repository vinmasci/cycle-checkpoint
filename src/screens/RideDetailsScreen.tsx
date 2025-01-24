import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Chip } from 'react-native-paper';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { database } from '../services/firebase';
import { ref, onValue, push } from 'firebase/database';
import { useAuth } from '../context/AuthContext';
import { Ride, CheckIn } from '../types';

export default function RideDetailsScreen({ route, navigation }: any) {
  const { rideId } = route.params;
  const [ride, setRide] = useState<Ride | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [checkIns, setCheckIns] = useState<Record<string, CheckIn>>({});
  const { user } = useAuth();

  useEffect(() => {
    const rideRef = ref(database, `rides/${rideId}`);
    const unsubscribe = onValue(rideRef, (snapshot) => {
      if (snapshot.exists()) {
        setRide({ id: rideId, ...snapshot.val() });
      }
    });

    return () => unsubscribe();
  }, [rideId]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);

      // Watch position updates
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (location) => {
          setUserLocation(location);
        }
      );
    })();
  }, []);

  const handleCheckIn = async (checkpointId: string) => {
    if (!userLocation || !user) return;

    const checkpointRef = ref(database, `rides/${rideId}/checkpoints/${checkpointId}/checkins`);
    await push(checkpointRef, {
      riderId: user.id,
      timestamp: Date.now(),
      location: {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      },
    });
  };

  const isNearCheckpoint = (checkpoint: any) => {
    if (!userLocation) return false;
    
    const distance = calculateDistance(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      checkpoint.location.latitude,
      checkpoint.location.longitude
    );
    
    return distance <= checkpoint.radiusMeters;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  if (!ride) return null;

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium">{ride.title}</Text>
      <Text variant="bodyLarge" style={styles.date}>
        {new Date(ride.date).toLocaleDateString()}
      </Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: ride.checkpoints[0]?.location.latitude || 37.78825,
          longitude: ride.checkpoints[0]?.location.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {ride.checkpoints?.map((checkpoint) => (
          <React.Fragment key={checkpoint.id}>
            <Marker
              coordinate={checkpoint.location}
              title={checkpoint.name}
            />
            <Circle
              center={checkpoint.location}
              radius={checkpoint.radiusMeters}
              fillColor="rgba(0, 150, 255, 0.2)"
              strokeColor="rgba(0, 150, 255, 0.5)"
            />
          </React.Fragment>
        ))}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}
      </MapView>

      <Text variant="titleMedium" style={styles.subtitle}>Checkpoints</Text>
      {ride.checkpoints?.map((checkpoint) => (
        <Card key={checkpoint.id} style={styles.card}>
          <Card.Title title={checkpoint.name} />
          <Card.Content>
            <View style={styles.chipContainer}>
              <Chip icon="map-marker">
                {Math.round(calculateDistance(
                  userLocation?.coords.latitude || 0,
                  userLocation?.coords.longitude || 0,
                  checkpoint.location.latitude,
                  checkpoint.location.longitude
                ))}m away
              </Chip>
              {isNearCheckpoint(checkpoint) && (
                <Chip icon="check" mode="outlined">Within range</Chip>
              )}
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => handleCheckIn(checkpoint.id)}
              disabled={!isNearCheckpoint(checkpoint)}
            >
              Check In
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  date: {
    marginTop: 5,
    marginBottom: 20,
    opacity: 0.7,
  },
  map: {
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
  },
  subtitle: {
    marginBottom: 15,
  },
  card: {
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
});