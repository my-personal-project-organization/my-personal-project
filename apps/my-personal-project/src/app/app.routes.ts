import { Route } from '@angular/router';
import { AuthTestComponent } from './pages/auth/auth.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'scribo',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthTestComponent,
  },
  {
    path: 'user-management',
    loadComponent: () =>
      import('./pages/user-management/user-management.component').then((m) => m.UserManagementComponent),
  },
  {
    path: 'user-management/:id/update',
    loadComponent: () =>
      import(
        './pages/user-management/components/user-management-update/user-management-update.component'
      ).then((m) => m.UserManagementUpdateComponent), //Update
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'scribo',
    children: [
      {
        path: 'list',
        loadComponent: () => import('@mpp/scribo/feature-article-list').then((m) => m.ArticleListComponent),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
