import { computed } from '@angular/core';
import { witFirestoreEntityStore, withDevtools } from '@mpp/shared/data-access';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities'; // Import EntityState
import { Article, ArticleSchema } from '../models/article.schema';

type ArticleStoreSate = {
  loading: boolean;
  error: string | null;
};
const initialState: ArticleStoreSate = {
  loading: false,
  error: null,
};

export const ArticleStore = signalStore(
  { providedIn: 'root' },
  // ? https://ngrx-toolkit.angulararchitects.io/docs/with-devtools
  withDevtools('articles'),
  withState(initialState),
  withEntities<Article>(),
  witFirestoreEntityStore<Article>('articles', ArticleSchema),
  withComputed((store) => ({
    getArticles: computed(() => store.entities()),
    // getArticleById: (id: string) => computed(() => store.entities().find((article) => article.id === id)),
    // getArticlesByUserId: (userId: string) =>
    //   computed(() => store.entities().filter((article) => article.userId === userId)),
    // getArticlesByTitle: (title: string) =>
    //   computed(() => store.entities().filter((article) => article.mainTitle.toLowerCase().includes(title.toLowerCase()))),
  })),
);
