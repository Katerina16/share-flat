import { Route } from '@angular/router';

export const CORE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./../ui/layout/layout.component').then(c => c.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('../home/feature/home/home.component').then(c => c.HomeComponent)
      }
    ]
  }
];
