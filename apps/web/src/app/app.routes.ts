import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('./core/core.routes').then(m => m.CORE_ROUTES)
  }
];
