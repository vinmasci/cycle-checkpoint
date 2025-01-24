import { ref, onValue, off } from 'firebase/database';
import { database } from './firebase';

type CheckInListener = (data: any) => void;

class NotificationService {
  private listeners: Map<string, CheckInListener> = new Map();

  subscribeToCheckIns(rideId: string, callback: CheckInListener) {
    const checkInsRef = ref(database, `rides/${rideId}/checkpoints`);
    
    const listener = onValue(checkInsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({
          type: 'CHECK_IN',
          rideId,
          data: snapshot.val()
        });
      }
    });

    this.listeners.set(rideId, listener);
  }

  unsubscribeFromCheckIns(rideId: string) {
    const checkInsRef = ref(database, `rides/${rideId}/checkpoints`);
    off(checkInsRef);
    this.listeners.delete(rideId);
  }
}

export const notificationService = new NotificationService();