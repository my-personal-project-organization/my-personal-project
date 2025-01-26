import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'scribo',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
  {
    path: 'scribo',
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('@mpp/scribo/feature-article-list').then(
            (m) => m.ArticleListComponent,
          ),
      },
      {
        path: '', // Empty path within 'scribo' to load a default component if needed
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
