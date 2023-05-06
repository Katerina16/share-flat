import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, map, switchMap } from 'rxjs';
import * as AuthSelectors from '../store/auth/selectors';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(AuthSelectors.selectToken).pipe(
    first(),
    map(token => token
      ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
      : req
    ),
    map(req => req.clone({ url: '/api' + req.url })),
    switchMap(next)
  );

};
