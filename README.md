# Cycle Checkpoint

A React Native mobile app for organizing and tracking group bike rides.

## Tech Stack & Dependencies
- React Native with Expo (^49.0.0)
- Firebase v10
- React Native Paper v5
- React Navigation v6
- TypeScript v5
- Expo Location

## Project Structure
```
cycle-checkpoint/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Button/     # Custom buttons
│   │   ├── Card/       # Card components
│   │   └── Form/       # Form components
│   ├── screens/         # Screen components
│   │   ├── auth/       # Authentication screens
│   │   ├── organizer/  # Organizer-specific screens
│   │   └── rider/      # Rider-specific screens
│   ├── navigation/      # Navigation setup
│   ├── services/        # Firebase services
│   ├── hooks/          # Custom hooks
│   ├── context/        # Context providers
│   └── utils/          # Helper functions
└── assets/             # Images, fonts, etc.
```

## Implementation Steps

### 1. Setup & Configuration (Week 1)
- Initialize Expo project: `npx create-expo-app -t expo-template-typescript`
- Configure Firebase: Set up Authentication and Realtime Database
- Set up React Navigation: Install @react-navigation/native and @react-navigation/stack
- Install React Native Paper: `npm install react-native-paper`

### 2. Authentication (Week 1-2)
- Implement sign up/login screens with email/password
- Add user role selection during signup
- Create user profile in Firebase

### 3. Route Organizer Features (Week 2-3)
- Create ride form with: title, date, max riders
- Add checkpoint management with map integration
- Build real-time tracking dashboard using Firebase Realtime Database

### 4. Rider Features (Week 3-4)
- List available rides with filtering
- Implement one-click registration
- Add location tracking with Expo Location
- Build check-in system using geofencing

### 5. Data Models

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'organizer' | 'rider';
  createdAt: number;
}

interface Ride {
  id: string;
  organizerId: string;
  title: string;
  date: string;
  maxRiders: number;
  checkpoints: Checkpoint[];
  riders: string[];
  status: 'upcoming' | 'active' | 'completed';
}

interface Checkpoint {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  radiusMeters: number;  // Geofence radius
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

### 6. Firebase Structure
```
/users
  /{userId}
    - email
    - name
    - role
    - createdAt

/rides
  /{rideId}
    - organizerId
    - title
    - date
    - maxRiders
    - status
    /checkpoints
      /{checkpointId}
        - name
        - location
        - radiusMeters
    /riders
      /{riderId}
        - joinedAt
    /checkins
      /{checkpointId}
        /{riderId}
          - timestamp
          - location
```

### 7. Development Guidelines
- Use TypeScript strict mode
- Implement proper error boundaries
- Add loading states using React Suspense
- Include form validation with Formik
- Follow Material Design guidelines
- Write Jest tests for critical features

### 8. Testing & Deployment (Week 4-5)
- Write unit tests with Jest and React Testing Library
- E2E testing with Detox
- Build with EAS Build
- Deploy to App Store and Play Store

## Getting Started

1. Clone repository
2. Install dependencies: `npm install`
3. Create Firebase project and add config to `.env`:
```
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx
FIREBASE_PROJECT_ID=xxx
FIREBASE_STORAGE_BUCKET=xxx
FIREBASE_MESSAGING_SENDER_ID=xxx
FIREBASE_APP_ID=xxx
```
4. Start development: `expo start`

## Key Files to Create First
1. `src/services/firebase.ts` - Firebase configuration
2. `src/navigation/AppNavigator.tsx` - Navigation setup
3. `src/screens/auth/SignUpScreen.tsx` - User registration
4. `src/context/AuthContext.tsx` - Authentication state

## Common Issues & Solutions
1. Location permission errors: Request permissions before accessing location
2. Firebase initialization: Ensure config matches .env exactly
3. TypeScript path aliases: Configure in tsconfig.json