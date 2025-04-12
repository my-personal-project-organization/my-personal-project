import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthStore } from '../state/auth.store';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const redirectTo = route.data['redirectTo'] as string; // Access the redirectTo value from route data

  if (!authStore.isAuthenticated()) {
    router.navigate([redirectTo || '/']); // Use the provided redirectTo or a default
    return false;
  }

  return true;
};
