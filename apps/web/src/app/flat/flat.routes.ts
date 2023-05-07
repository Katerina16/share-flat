import { Route } from '@angular/router';

export const FLAT_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'add',
    title: 'Размещение объявления - Share Flat',
    loadComponent: () => import('./feature/flat-add/flat-add.component').then(c => c.FlatAddComponent)
  },
  {
    path: 'edit/:id',
    title: 'Редактирование объявления - Share Flat',
    loadComponent: () => import('./feature/flat-edit/flat-edit.component').then(c => c.FlatEditComponent)
  },
  {
    path: 'list',
    title: 'Объявления - Share Flat',
    loadComponent: () => import('./feature/flat-list/flat-list.component').then(c => c.FlatListComponent)
  },
  {
    path: 'card/:id',
    title: 'Объявление - Share Flat',
    loadComponent: () => import('./feature/flat-card/flat-card.component').then(c => c.FlatCardComponent)
  }
];