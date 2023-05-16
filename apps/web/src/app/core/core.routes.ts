import { Route } from '@angular/router';

export const CORE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./../ui/layout/layout.component').then(c => c.LayoutComponent),
    children: [
      {
        path: '',
        title: 'Share Flat',
        loadComponent: () => import('../home/feature/home/home.component').then(c => c.HomeComponent)
      },
      {
        path: 'flat',
        loadChildren: () => import('../flat/flat.routes').then(m => m.FLAT_ROUTES)
      },
      {
        path: 'reservation',
        loadChildren: () => import('../reservation/reservation.routes').then(m => m.RESERVATION_ROUTES)
      }
    ]
  }
];
