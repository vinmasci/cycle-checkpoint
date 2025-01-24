import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, FAB, Card, Button, IconButton } from 'react-native-paper';
import { database } from '../../services/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';
import { Ride } from '../../types';

export default function OrganizerDashboard({ navigation }: any) {
  const [rides, setRides] = useState<Ride[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const ridesRef = ref(database, 'rides');
    const unsubscribe = onValue(ridesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ridesList = Object.entries(data)
          .map(([id, ride]: [string, any]) => ({ id, ...ride }))
          .filter((ride) => ride.organizerId === user.id);
        setRides(ridesList);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const RideCard = ({ ride }: { ride: Ride }) => (
    <Card style={styles.card}>
      <Card.Title
        title={ride.title}
        subtitle={new Date(ride.date).toLocaleDateString()}
        right={(props) => (
          <IconButton
            {...props}
            icon="dots-vertical"
            onPress={() => navigation.navigate('RideDetails', { rideId: ride.id })}
          />
        )}
      />
      <Card.Content>
        <Text>Riders: {ride.riders?.length || 0}</Text>
        <Text>Checkpoints: {ride.checkpoints?.length || 0}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('TrackRide', { rideId: ride.id })}>
          Track Ride
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text variant="headlineMedium" style={styles.title}>Your Rides</Text>
        {rides.length === 0 ? (
          <Text style={styles.empty}>No rides created yet</Text>
        ) : (
          rides.map((ride) => <RideCard key={ride.id} ride={ride} />)
        )}
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateRide')}
      />
    </View>
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
  card: {
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});