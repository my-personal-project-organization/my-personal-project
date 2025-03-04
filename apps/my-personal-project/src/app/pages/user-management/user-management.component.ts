import { Component, computed, inject, Signal } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUser, User, UserStore } from '@mpp/shared/data-access';
import { ButtonComponent } from '@mpp/shared/ui';

@Component({
  selector: 'app-test',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  providers: [UserStore],
})
export class UserManagementComponent {
  private userStore = inject(UserStore);
  private router = inject(Router);

  // Signals for state
  users: Signal<User[]> = this.userStore.entities;
  loading = this.userStore.loading;
  error = this.userStore.error;

  // New user input
  newUser: NewUser = {
    // _id: '',
    // username: '',
    // email: '',
    // firstName: '',
    // lastName: '',
    // profilePicture: '',
    // createdAt: new Date(), // These will be overridden by the store, but we need them for the type
    // updatedAt: new Date(),
  };

  //For updating users
  selectedUser: User | null = null;
  //Search term
  searchTerm = '';

  // Computed signal for filtered users (add this)
  filteredUsers = computed(() => {
    const searchTerm = this.searchTerm.toLowerCase();
    return this.users().filter((user) => user.username.toLowerCase().includes(searchTerm));
  });
  searchResult = computed(() => {
    if (this.searchTerm.trim() === '' || this.searchTerm.length < 3) {
      return this.users(); // Return all users if search term is empty
    } else {
      return this.filteredUsers();
    }
  });

  constructor() {
    this.loadUsers(); // Load users on component initialization
  }

  loadUsers() {
    this.userStore.loadAll();
  }

  addUser() {
    // Basic validation (you'd ideally do more robust validation, ideally with Zod)
    if (this.newUser['username'] && this.newUser['email']) {
      this.userStore.add(this.newUser).then((user) => {
        //Use the promise
        if (user) {
          // Reset the form on success
          this.newUser = {
            _id: '',
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            profilePicture: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
      });
    } else {
      alert('Please enter username and email.'); // Replace with better UI feedback
    }
  }

  deleteUser(id: string) {
    console.log('deleting user: ', id);

    this.userStore.delete(id);
  }

  selectUserForUpdate(user: User) {
    this.router.navigate(['/user-management', user.id, 'update']);
  }

  updateUser() {
    console.log('Updating user');

    // if (this.selectedUser) {
    //   this.userStore.update(this.selectedUser.id, this.selectedUser).then((userUpdated) => {
    //     if (userUpdated) {
    //       this.selectedUser = null; // Clear the form
    //     }
    //   });
    // }
  }
  searchUsers() {
    if (this.searchTerm.length > 2) {
      this.userStore.loadByQuery(
        where('username', '>=', this.searchTerm),
        where('username', '<=', this.searchTerm + '\uf8ff'),
      );
    }
  }
}
