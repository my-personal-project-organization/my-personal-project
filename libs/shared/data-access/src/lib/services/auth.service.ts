import { Injectable, inject, isDevMode } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  UserCredential,
  authState,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { mockUserCredential } from '../mocks/auth.mock';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  user$ = authState(this.auth);

  signInWithGithub(): Observable<UserCredential> {
    if (isDevMode()) {
      return of(mockUserCredential);
    } else {
      const provider = new GithubAuthProvider();
      return from(signInWithPopup(this.auth, provider));
    }
  }

  signOutUser(): Observable<void> {
    return from(signOut(this.auth));
  }
}
