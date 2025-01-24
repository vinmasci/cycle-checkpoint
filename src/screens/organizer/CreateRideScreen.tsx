import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Portal, Modal } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { database } from '../../services/firebase';
import { ref, push } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';
import { Checkpoint } from '../../types';

export default function CreateRideScreen({ navigation }: any) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkpointName, setCheckpointName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleCreateRide = async () => {
    if (!title || !date || checkpoints.length === 0) {
      return;
    }

    const ridesRef = ref(database, 'rides');
    await push(ridesRef, {
      title,
      date,
      checkpoints,
      organizerId: user?.id,
      status: 'upcoming',
      riders: {},
    });

    navigation.goBack();
  };

  const addCheckpoint = () => {
    if (checkpointName && selectedLocation) {
      setCheckpoints([
        ...checkpoints,
        {
          id: Date.now().toString(),
          name: checkpointName,
          location: selectedLocation,
          radiusMeters: 50,
        },
      ]);
      setModalVisible(false);
      setCheckpointName('');
      setSelectedLocation(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Create New Ride</Text>

      <TextInput
        label="Ride Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        mode="outlined"
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.subtitle}>Checkpoints</Text>
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
      >
        {checkpoints.map((checkpoint) => (
          <Marker
            key={checkpoint.id}
            coordinate={checkpoint.location}
            title={checkpoint.name}
          />
        ))}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            pinColor="blue"
          />
        )}
      </MapView>

      <Button 
        mode="contained" 
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        Add Checkpoint
      </Button>

      <Button 
        mode="contained"
        onPress={handleCreateRide}
        style={styles.button}
        disabled={!title || !date || checkpoints.length === 0}
      >
        Create Ride
      </Button>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Add Checkpoint
          </Text>
          
          <TextInput
            label="Checkpoint Name"
            value={checkpointName}
            onChangeText={setCheckpointName}
            mode="outlined"
            style={styles.input}
          />

          <Text style={styles.helper}>
            Tap on the map to set checkpoint location
          </Text>

          <Button 
            mode="contained"
            onPress={addCheckpoint}
            disabled={!checkpointName || !selectedLocation}
          >
            Add
          </Button>
        </Modal>
      </Portal>
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
  subtitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  map: {
    height: 300,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    marginBottom: 15,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 15,
  },
  helper: {
    marginVertical: 10,
    opacity: 0.7,
  },
});