import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserStore } from '@mpp/shared/data-access';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '@mpp/shared/ui';

@Component({
  selector: 'app-user-management-update',
  templateUrl: './user-management-update.component.html',
  styleUrls: ['./user-management-update.component.scss'],
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementUpdateComponent implements OnInit, OnDestroy {
  private userStore = inject(UserStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routeSubscription: Subscription | undefined;

  // Signals
  loading = this.userStore.loading; // Loading state from store
  error = this.userStore.error; // Error state from store
  user = signal<User | null>(null); // Signal for the *individual* user being edited

  // Computed signal to get a single user by ID
  currentUser = computed(() => {
    const userId = this.route.snapshot.paramMap.get('id');
    if (!userId) {
      return undefined;
    }
    return this.userStore.entities().find((user) => user.id === userId);
  });

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');
      if (userId) {
        // Use loadOne to get up-to-date data
        this.userStore.loadOne(userId).then(() => {
          const user = this.currentUser();
          if (user) {
            this.user.set({ ...user }); // Important: Create a *copy* for editing.
          } else {
            this.router.navigate(['/user-management']); //If the user does not exists
          }
        }); // Load the user data
      } else {
        // Handle missing ID (e.g., redirect to a list page)
        this.router.navigate(['/user-management']); // Redirect to a list view, for example
      }
    });
  }
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  updateUser() {
    if (this.user() && this.user()?.id) {
      const currentUser = this.user();
      if (!currentUser) {
        return;
      }
      this.userStore.update(this.user()!.id, this.user()!).then((updatedUser) => {
        // Use update from store
        if (updatedUser) {
          this.router.navigate(['/user-management']); // Navigate back to the list
        } else {
          //Handle error
        }
      });
    }
  }
  goBack() {
    this.router.navigate(['/user-management']);
  }
}
