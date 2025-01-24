# Cycle Checkpoint

A React Native mobile app for organizing and tracking group bike rides.

## Tech Stack
- React Native with Expo
- Firebase (Authentication, Realtime Database)
- Material UI (React Native Paper)

## Project Structure
```
cycle-checkpoint/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation setup
│   ├── services/        # Firebase services
│   ├── hooks/           # Custom hooks
│   ├── context/         # Context providers
│   └── utils/           # Helper functions
└── assets/             # Images, fonts, etc.
```

## Implementation Steps

### 1. Setup & Configuration (Week 1)
- Initialize Expo project
- Configure Firebase
- Set up React Navigation
- Install and configure React Native Paper

### 2. Authentication (Week 1-2)
- Implement sign up/login screens
- Add user role selection (Route Organizer/Rider)
- Create user profile management

### 3. Route Organizer Features (Week 2-3)
- Create ride creation form
- Implement checkpoint management
- Add rider list view
- Build real-time tracking dashboard

### 4. Rider Features (Week 3-4)
- Develop available rides list
- Create ride registration
- Implement checkpoint check-in system
- Add real-time location tracking

### 5. Data Models

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'organizer' | 'rider';
}

interface Ride {
  id: string;
  organizerId: string;
  title: string;
  date: string;
  checkpoints: Checkpoint[];
  riders: string[];
}

interface Checkpoint {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface CheckIn {
  riderId: string;
  checkpointId: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
}
```

### 6. Key Features

#### Route Organizer
- Create/manage rides
- Set checkpoints
- View rider check-ins
- Real-time rider tracking

#### Rider
- Browse/join rides
- View checkpoint locations
- Check in at checkpoints
- Share location with organizer

### 7. Development Guidelines
- Use TypeScript for type safety
- Implement proper error handling
- Add loading states
- Include form validation
- Follow Material Design guidelines
- Write unit tests for critical features

### 8. Testing & Deployment (Week 4-5)
- Write unit tests
- Perform end-to-end testing
- Deploy to App Store and Play Store

## Getting Started

1. Clone repository
2. Install dependencies: `npm install`
3. Set up Firebase config
4. Start development server: `expo start`