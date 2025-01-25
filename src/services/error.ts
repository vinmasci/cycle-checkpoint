interface ErrorDetails {
  code: string;
  message: string;
  technical?: string;
}

class ErrorService {
  private errorMap: Record<string, ErrorDetails> = {
    'auth/invalid-email': {
      code: 'AUTH_001',
      message: 'Please enter a valid email address',
    },
    'auth/user-not-found': {
      code: 'AUTH_002',
      message: 'No account found with this email',
    },
    'auth/wrong-password': {
      code: 'AUTH_003',
      message: 'Incorrect password',
    },
    'location/permission-denied': {
      code: 'LOC_001',
      message: 'Location permission is required for check-ins',
    },
    'network/unavailable': {
      code: 'NET_001',
      message: 'No internet connection available',
    },
  };

  handleError(error: any): ErrorDetails {
    console.error('Error caught:', error);

    if (error?.code && this.errorMap[error.code]) {
      return this.errorMap[error.code];
    }

    // Handle Firebase errors
    if (error?.message?.includes('firebase')) {
      return {
        code: 'FIREBASE_ERROR',
        message: 'Service temporarily unavailable',
        technical: error.message,
      };
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      return this.errorMap['network/unavailable'];
    }

    // Default error
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Something went wrong. Please try again.',
      technical: error?.message,
    };
  }

  isNetworkError(error: any): boolean {
    return (
      error?.code === 'network/unavailable' ||
      (error instanceof TypeError && error.message.includes('Network request failed'))
    );
  }

  isAuthError(error: any): boolean {
    return error?.code?.startsWith('auth/');
  }
}

export const errorService = new ErrorService();