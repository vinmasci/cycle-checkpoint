import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { database } from '../../services/firebase';
import { ref, onValue, update } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';
import { Ride } from '../../types';

export default function RiderDashboard({ navigation }: any) {
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const ridesRef = ref(database, 'rides');
    const unsubscribe = onValue(ridesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allRides = Object.entries(data).map(([id, ride]: [string, any]) => ({
          id,
          ...ride,
        }));

        setAvailableRides(
          allRides.filter(
            (ride) => 
              !ride.riders?.includes(user.id) && 
              new Date(ride.date) > new Date()
          )
        );

        setMyRides(
          allRides.filter((ride) => ride.riders?.includes(user.id))
        );
      }
    });

    return () => unsubscribe();
  }, [user]);

  const joinRide = async (rideId: string) => {
    const rideRef = ref(database, `rides/${rideId}/riders`);
    const newRider = user?.id;
    await update(rideRef, { [newRider]: true });
  };

  const RideCard = ({ ride, isJoined }: { ride: Ride; isJoined: boolean }) => (
    <Card style={styles.card}>
      <Card.Title
        title={ride.title}
        subtitle={new Date(ride.date).toLocaleDateString()}
      />
      <Card.Content>
        <View style={styles.chips}>
          <Chip icon="account-group">
            {Object.keys(ride.riders || {}).length} riders
          </Chip>
          <Chip icon="map-marker">
            {ride.checkpoints?.length || 0} checkpoints
          </Chip>
        </View>
      </Card.Content>
      <Card.Actions>
        {isJoined ? (
          <Button 
            onPress={() => navigation.navigate('RideDetails', { rideId: ride.id })}
          >
            View Details
          </Button>
        ) : (
          <Button onPress={() => joinRide(ride.id)}>Join Ride</Button>
        )}
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>My Rides</Text>
      {myRides.length === 0 ? (
        <Text style={styles.empty}>No rides joined yet</Text>
      ) : (
        myRides.map((ride) => (
          <RideCard key={ride.id} ride={ride} isJoined={true} />
        ))
      )}

      <Text variant="headlineMedium" style={[styles.title, styles.section]}>
        Available Rides
      </Text>
      {availableRides.length === 0 ? (
        <Text style={styles.empty}>No available rides</Text>
      ) : (
        availableRides.map((ride) => (
          <RideCard key={ride.id} ride={ride} isJoined={false} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  card: {
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.5,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
});