import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, DataTable, IconButton } from 'react-native-paper';
import MapView, { Marker, Circle } from 'react-native-maps';
import { database } from '../../services/firebase';
import { ref, onValue } from 'firebase/database';
import { Ride, CheckIn } from '../../types';

export default function TrackRideScreen({ route }: any) {
  const { rideId } = route.params;
  const [ride, setRide] = useState<Ride | null>(null);
  const [checkIns, setCheckIns] = useState<Record<string, Record<string, CheckIn>>>({});
  const [riders, setRiders] = useState<Record<string, any>>({});

  useEffect(() => {
    const rideRef = ref(database, `rides/${rideId}`);
    const checkInsRef = ref(database, `rides/${rideId}/checkpoints`);
    const ridersRef = ref(database, 'users');

    const unsubscribeRide = onValue(rideRef, (snapshot) => {
      if (snapshot.exists()) {
        setRide({ id: rideId, ...snapshot.val() });
      }
    });

    const unsubscribeCheckIns = onValue(checkInsRef, (snapshot) => {
      if (snapshot.exists()) {
        setCheckIns(snapshot.val());
      }
    });

    const unsubscribeRiders = onValue(ridersRef, (snapshot) => {
      if (snapshot.exists()) {
        setRiders(snapshot.val());
      }
    });

    return () => {
      unsubscribeRide();
      unsubscribeCheckIns();
      unsubscribeRiders();
    };
  }, [rideId]);

  if (!ride) return null;

  const getRiderProgress = (riderId: string) => {
    let completed = 0;
    ride.checkpoints?.forEach((checkpoint) => {
      if (checkIns[checkpoint.id]?.[riderId]) {
        completed++;
      }
    });
    return completed;
  };

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
      </MapView>

      <Card style={styles.card}>
        <Card.Title title="Rider Progress" />
        <Card.Content>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Rider</DataTable.Title>
              <DataTable.Title numeric>Checkpoints</DataTable.Title>
              <DataTable.Title numeric>Progress</DataTable.Title>
            </DataTable.Header>

            {Object.keys(ride.riders || {}).map((riderId) => {
              const completed = getRiderProgress(riderId);
              const total = ride.checkpoints?.length || 0;
              const progress = (completed / total) * 100;

              return (
                <DataTable.Row key={riderId}>
                  <DataTable.Cell>{riders[riderId]?.name || 'Unknown'}</DataTable.Cell>
                  <DataTable.Cell numeric>{`${completed}/${total}`}</DataTable.Cell>
                  <DataTable.Cell numeric>{`${Math.round(progress)}%`}</DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Checkpoint Details" />
        <Card.Content>
          {ride.checkpoints?.map((checkpoint) => {
            const checkInCount = Object.keys(checkIns[checkpoint.id] || {}).length;
            
            return (
              <View key={checkpoint.id} style={styles.checkpointRow}>
                <Text variant="titleMedium">{checkpoint.name}</Text>
                <Text>{`${checkInCount} check-ins`}</Text>
                <IconButton
                  icon="chevron-right"
                  onPress={() => {/* Navigate to detailed view */}}
                />
              </View>
            );
          })}
        </Card.Content>
      </Card>
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
  card: {
    marginBottom: 20,
  },
  checkpointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
});