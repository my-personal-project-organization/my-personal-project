import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // ? https://dev.to/danywalls/angular-19-and-zoneless-1of9 https://angularengineering.com/2024/05/27/angular-18-how-to-remove-zone-js/
    provideExperimentalZonelessChangeDetection(),
    // ? https://www.linkedin.com/posts/koustubhmishra_angular-angular-zone-activity-7249282431067840512-YJoY
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};
