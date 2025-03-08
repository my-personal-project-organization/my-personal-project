import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '@mpp/shared/data-access'; // Import AuthStore

@Component({
  selector: 'ui-auth-test',
  imports: [CommonModule],
  template: `
    <div>
      @if (authStore.loading()) {
        <p>Loading...</p>
      }
      @if (authStore.error()) {
        <p>Error: {{ authStore.error() }}</p>
      }
      @if (authStore.user(); as user) {
        <p>User: {{ user.displayName }} ({{ user.email }})</p>
        <button (click)="signOut()">Sign Out</button>
      } @else {
        <button (click)="signIn()">Sign In with GitHub</button>
      }
    </div>
  `,
})
export class AuthTestComponent {
  authStore = inject(AuthStore);

  constructor() {
    this.authStore.loadUser();
  }
  signIn() {
    this.authStore.signInWithGithub();
  }

  signOut() {
    this.authStore.signOutUser();
  }
}
