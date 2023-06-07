import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const isLoggedIn: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService)
    .isLoggedIn()
    .pipe(
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          router.navigate(['/']).catch(console.error);
        }
      }),
      catchError((error) => {
        router.navigate(['/']).catch(console.error);
        throw error;
      })
    );
};
