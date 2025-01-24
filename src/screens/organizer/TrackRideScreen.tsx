import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, DataTable, IconButton, Snackbar } from 'react-native-paper';
import MapView, { Marker, Circle } from 'react-native-maps';
import { database } from '../../services/firebase';
import { ref, onValue } from 'firebase/database';
import { notificationService } from '../../services/notifications';
import { Ride, CheckIn } from '../../types';

export default function TrackRideScreen({ route }: any) {
  const { rideId } = route.params;
  const [ride, setRide] = useState<Ride | null>(null);
  const [checkIns, setCheckIns] = useState<Record<string, Record<string, CheckIn>>>({});
  const [riders, setRiders] = useState<Record<string, any>>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const rideRef = ref(database, `rides/${rideId}`);
    const ridersRef = ref(database, 'users');

    const unsubscribeRide = onValue(rideRef, (snapshot) => {
      if (snapshot.exists()) {
        setRide({ id: rideId, ...snapshot.val() });
      }
    });

    const unsubscribeRiders = onValue(ridersRef, (snapshot) => {
      if (snapshot.exists()) {
        setRiders(snapshot.val());
      }
    });

    // Subscribe to check-in notifications
    notificationService.subscribeToCheckIns(rideId, (data) => {
      setCheckIns(data.data);
      const lastCheckIn = findLastCheckIn(data.data);
      if (lastCheckIn) {
        const riderName = riders[lastCheckIn.riderId]?.name || 'A rider';
        const checkpointName = ride?.checkpoints.find(cp => cp.id === lastCheckIn.checkpointId)?.name || 'checkpoint';
        setNotification(`${riderName} checked in at ${checkpointName}`);
        setSnackbarVisible(true);
      }
    });

    return () => {
      unsubscribeRide();
      unsubscribeRiders();
      notificationService.unsubscribeFromCheckIns(rideId);
    };
  }, [rideId]);

  const findLastCheckIn = (checkInsData: any) => {
    let lastCheckIn = null;
    let lastTimestamp = 0;

    Object.entries(checkInsData).forEach(([checkpointId, checkpointData]: [string, any]) => {
      Object.entries(checkpointData).forEach(([riderId, checkIn]: [string, any]) => {
        if (checkIn.timestamp > lastTimestamp) {
          lastTimestamp = checkIn.timestamp;
          lastCheckIn = { ...checkIn, riderId, checkpointId };
        }
      });
    });

    return lastCheckIn;
  };

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
    <View style={styles.container}>
      <ScrollView>
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

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {notification}
      </Snackbar>
    </View>
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