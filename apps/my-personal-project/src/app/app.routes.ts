import { Route } from '@angular/router';
import { ScriboFeatureLayoutComponent } from '@mpp/scribo/feature-layout';
import { AuthGuard } from '@mpp/shared/data-access';

export const appRoutes: Route[] = [
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
      ).then((m) => m.UserManagementUpdateComponent),
  },
  {
    path: 'landing',
    loadComponent: () => import('@mpp/cv/feature-about').then((m) => m.LandingComponent),
  },
  // {
  //   path: 'landing',
  //   loadComponent: () =>
  //     import('./pages/landing-page/landing-page.component').then((m) => m.LandingPageComponent),
  // },
  {
    path: 'scribo',
    component: ScriboFeatureLayoutComponent,
    children: [
      {
        path: 'landing',
        loadComponent: () => import('@mpp/scribo/feature-landing').then((m) => m.LandingComponent),
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        data: {
          redirectTo: '/scribo/landing',
        },
        loadComponent: () => import('@mpp/scribo/feature-article-list').then((m) => m.ArticleListComponent),
      },
      {
        path: 'user-profile',
        // Todo: Add a route guard to protect this route
        loadComponent: () =>
          import('@mpp/scribo/feature-user-profile').then((m) => m.ScriboFeatureUserProfileComponent),
      },
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'scribo/landing',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

// ! HERE
// ! HERE
// ! HERE
// User Data Page: You're correct to consider whether user data management belongs in this library.  It depends on how extensive the user data features are:

// Small, Self-Contained: If the user data is only a profile summary displayed on the dashboard, it's fine to keep it within @mpp/scribo/feature-dashboard.

// Extensive User Management: If you have features like:

// Editing profile details (name, email, password, avatar)
// User settings (preferences, notifications)
// Account management (deletion, subscription)
// User roles/permissions
// Then a separate library like @mpp/scribo/feature-user-profile (or @mpp/scribo/feature-account) is a much better choice. This keeps your dashboard library focused and avoids it becoming bloated.
// The principle of high cohesion, low coupling is key here.
