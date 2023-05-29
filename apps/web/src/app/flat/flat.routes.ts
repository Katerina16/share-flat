import { Route } from '@angular/router';
import { isLoggedIn } from '../core/guards/logged-in.guard';

export const FLAT_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'search'
  },
  {
    path: 'add',
    title: 'Размещение объявления - Share Flat',
    loadComponent: () => import('./feature/flat-add/flat-add.component').then(c => c.FlatAddComponent)
  },
  {
    path: 'edit/:id',
    canActivate: [isLoggedIn],
    title: 'Редактирование объявления - Share Flat',
    loadComponent: () => import('./feature/flat-edit/flat-edit.component').then(c => c.FlatEditComponent)
  },
  {
    path: 'search',
    title: 'Объявления - Share Flat',
    loadComponent: () => import('./feature/flat-list/flat-list.component').then(c => c.FlatListComponent)
  },
  {
    path: 'card/:id',
    title: 'Объявление - Share Flat',
    loadComponent: () => import('./feature/flat-card/flat-card.component').then(c => c.FlatCardComponent)
  }
];
