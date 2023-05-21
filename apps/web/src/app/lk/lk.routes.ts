import { Route } from '@angular/router';

export const LK_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./ui/lk-layout/lk-layout.component').then(c => c.LkLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Профиль - Share Flat',
        loadComponent: () => import('./feature/profile/profile.component').then(c => c.ProfileComponent)
      },
      {
        path: 'flats',
        title: 'Мои квартиры - Share Flat',
        loadComponent: () => import('./feature/lk-flats/lk-flats.component').then(c => c.LkFlatsComponent)
      },
      {
        path: 'reservations',
        title: 'Бронирования моих квартир - Share Flat',
        loadComponent: () =>
          import('./feature/lk-reservations/lk-reservations.component').then(c => c.LkReservationsComponent)
      }
    ]
  }
];
