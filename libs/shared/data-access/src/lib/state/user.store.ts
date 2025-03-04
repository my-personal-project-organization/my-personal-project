import { signalStore, withState } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities'; // Import EntityState
import { User, UserSchema } from '../models/user.schema';
import { withDevtools } from './devtools/with-devtools';
import { witFirestoreEntityStore } from './firestore-entity-store';

type UserStoreSate = {
  loading: boolean;
  error: string | null;
};
const initialState: UserStoreSate = {
  loading: false,
  error: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  // ? https://ngrx-toolkit.angulararchitects.io/docs/with-devtools
  withDevtools('users'),
  withState(initialState),
  withEntities<User>(),
  witFirestoreEntityStore<User>('users', UserSchema), // Correct: Pass User, UserSchema
  //   withComputed((store) => ({
  //     // Example computed signal: Get users with a specific first name
  //     usersByFirstName: (firstName: string) =>
  //       computed(() => store.entities().filter((user) => user.firstName === firstName)),
  //   })),
  // withHooks((store) => ({
  //   onInit() {
  //     // Load products when the store is initialized
  //     store.loadAll();
  //   },
  // })),
);
