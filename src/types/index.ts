export interface User {
  id: string;
  email: string;
  name: string;
  role: 'organizer' | 'rider';
}

export interface Ride {
  id: string;
  organizerId: string;
  title: string;
  date: string;
  checkpoints: Checkpoint[];
  riders: string[];
}

export interface Checkpoint {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface CheckIn {
  riderId: string;
  checkpointId: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
}