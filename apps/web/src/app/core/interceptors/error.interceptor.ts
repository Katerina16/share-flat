import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError } from 'rxjs';
import { logout } from '../store/auth/actions';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(TuiAlertService);
  const store = inject(Store);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        store.dispatch(logout());
      } else {
        alertService.open(error.error?.message || error.message, { status: TuiNotification.Error }).subscribe();
      }

      throw error;
    })
  );
};
