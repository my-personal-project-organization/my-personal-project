/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { withDevtools } from './devtools/with-devtools';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  // ? https://ngrx-toolkit.angulararchitects.io/docs/with-devtools
  withDevtools('auth'),
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.user()),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    signInWithGithub: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          authService.signInWithGithub().pipe(
            tap({
              next: (credential) => {
                patchState(store, { user: credential.user, loading: false });
              },
              error: (error: any) => {
                console.error(error || 'Sign in failed.');
                patchState(store, { loading: false, error: error.message || 'Sign in failed.' });
              },
            }),
          ),
        ),
      ),
    ),
    signOutUser: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          authService.signOutUser().pipe(
            tap({
              next: () => {
                patchState(store, { user: null, loading: false });
              },
              error: (error: any) => {
                console.error(error || 'Sign out failed.');
                patchState(store, { loading: false, error: error.message || 'Sign out failed.' });
              },
            }),
          ),
        ),
      ),
    ),
    loadUser: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          authService.user$.pipe(
            tap({
              next: (user) => {
                patchState(store, { user, loading: false });
              },
              error: (error: any) => {
                console.error(error || 'Failed to load user.');
                patchState(store, { user: null, loading: false, error: error.message });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
