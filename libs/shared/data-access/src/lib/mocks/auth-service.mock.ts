import { UserCredential } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services';
import { mockUserCredential } from './auth.mock';

class MockAuthService {
  signInWithGithub(): Observable<UserCredential> {
    return of(mockUserCredential);
  }
  signOutUser() {
    console.log('Mock signOutUser called');
    return of(undefined);
  }
}
export function provideMockAuthService() {
  return {
    provide: AuthService,
    useClass: MockAuthService,
  };
}
