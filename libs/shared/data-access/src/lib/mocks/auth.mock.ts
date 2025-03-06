import { UserCredential } from '@angular/fire/auth';

export const mockUserCredential: UserCredential = {
  user: {
    uid: 'mock-user-uid',
    displayName: 'Mock User',
    email: 'mockuser@example.com',
    photoURL: 'https://via.placeholder.com/150',
    providerData: [
      {
        providerId: 'github.com',
        uid: 'mock-github-uid',
        displayName: 'Mock User',
        email: 'mockuser@example.com',
        photoURL: 'https://via.placeholder.com/150',
      },
    ],
    // ... more properties
  } as any,
  providerId: 'github.com',
  operationType: 'signIn',
};
