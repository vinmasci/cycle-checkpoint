import { ref, onValue, off } from 'firebase/database';
import { notificationService } from '../notifications';

jest.mock('firebase/database');

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('subscribes to check-ins', () => {
    const mockCallback = jest.fn();
    const mockSnapshot = {
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue({ checkpointId: { riderId: { timestamp: Date.now() } } })
    };

    (ref as jest.Mock).mockReturnValue('mockedRef');
    (onValue as jest.Mock).mockImplementation((_, callback) => {
      callback(mockSnapshot);
      return jest.fn();
    });

    notificationService.subscribeToCheckIns('ride-123', mockCallback);

    expect(ref).toHaveBeenCalledWith(expect.anything(), 'rides/ride-123/checkpoints');
    expect(onValue).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledWith({
      type: 'CHECK_IN',
      rideId: 'ride-123',
      data: expect.any(Object)
    });
  });

  it('unsubscribes from check-ins', () => {
    (ref as jest.Mock).mockReturnValue('mockedRef');

    notificationService.unsubscribeFromCheckIns('ride-123');

    expect(ref).toHaveBeenCalledWith(expect.anything(), 'rides/ride-123/checkpoints');
    expect(off).toHaveBeenCalledWith('mockedRef');
  });

  it('handles non-existent data', () => {
    const mockCallback = jest.fn();
    const mockSnapshot = {
      exists: jest.fn().mockReturnValue(false),
      val: jest.fn()
    };

    (ref as jest.Mock).mockReturnValue('mockedRef');
    (onValue as jest.Mock).mockImplementation((_, callback) => {
      callback(mockSnapshot);
      return jest.fn();
    });

    notificationService.subscribeToCheckIns('ride-123', mockCallback);

    expect(mockCallback).not.toHaveBeenCalled();
  });
});