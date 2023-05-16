import { Route } from '@angular/router';

export const RESERVATION_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    title: 'Бронирования - Share Flat',
    loadComponent: () =>
      import('./feature/reservation-list/reservation-list.component').then(c => c.ReservationListComponent)
  },
  {
    path: 'card/:id',
    title: 'Бронирование - Share Flat',
    loadComponent: () =>
      import('./feature/reservation-card/reservation-card.component').then(c => c.ReservationCardComponent)
  }
];
