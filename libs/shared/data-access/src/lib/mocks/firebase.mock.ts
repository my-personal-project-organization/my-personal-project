import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';

export function provideMockFirebaseConfig() {
  return [
    // Mock FirebaseApp provider
    provideFirebaseApp(() => {
      // Return a mock FirebaseApp object.
      // Adjust the properties as needed based on what @angular/fire might expect.
      // Often, a minimal object is sufficient for DI purposes.
      console.log('Using Mock Firebase App');
      return {
        name: 'mock-app',
        options: {},
        automaticDataCollectionEnabled: false,
        // Add other properties or methods if required by your setup or other providers
      } as any; // Using 'as any' for simplicity, refine if strict typing is needed
    }),
    // Mock Firestore provider
    provideFirestore(() => {
      console.log('Using Mock Firestore');
      // Return a mock Firestore instance.
      // Implement methods if your component interacts with Firestore directly during init.
      return {
        // Mock methods like collection, doc, etc., if necessary
      } as any; // Using 'as any' for simplicity
    }),
    // Mock Auth provider
    provideAuth(() => {
      console.log('Using Mock Auth');
      // Return a mock Auth instance.
      // Implement methods/properties like onAuthStateChanged, currentUser if needed.
      return {
        // Mock properties like currentUser: null
        // Mock methods like onAuthStateChanged: () => of(null) // Example using RxJS 'of'
      } as any; // Using 'as any' for simplicity
    }),
  ];
}
