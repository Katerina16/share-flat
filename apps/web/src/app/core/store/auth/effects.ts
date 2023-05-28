import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError, exhaustMap, filter, map, of, tap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { AppState } from '../reducers';
import * as AuthActions from './actions';
import * as AuthSelectors from './selectors';

@Injectable()
export class AuthEffects {
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(action =>
        this.authService.register(action.data).pipe(
          tap(() => {
            this.alertService.open('Вы успешно зарегистрированы!', { status: TuiNotification.Success }).subscribe();
          }),
          map(() => AuthActions.registerSuccess()),
          catchError(() => of(AuthActions.registerFail()))
        )
      )
    )
  );

  registerSuccess$ = createEffect(() => this.actions$.pipe(ofType(AuthActions.registerSuccess)), { dispatch: false });

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.data).pipe(
          map(data => AuthActions.loginSuccess(data)),
          catchError(() => of(AuthActions.loginFail()))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(data => localStorage.setItem('token', data.token))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => localStorage.removeItem('token'))
      ),
    { dispatch: false }
  );

  tryGetCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.tryGetCurrentUser),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectToken)),
      filter(([, token]) => !!token),
      map(() => AuthActions.getCurrentUser())
    )
  );

  getCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getCurrentUser),
      exhaustMap(() =>
        this.authService.getCurrentUser().pipe(
          map(user => AuthActions.getCurrentUserSuccess({ user })),
          catchError(() => of(AuthActions.getCurrentUserFail()))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      exhaustMap(action =>
        this.authService.updateUser(action.user).pipe(
          tap(() => {
            this.alertService.open('Профиль успешно изменен!', { status: TuiNotification.Success }).subscribe();
          }),
          map(() => AuthActions.updateUserSuccess({ user: action.user })),
          catchError(() => of(AuthActions.updateUserFail()))
        )
      )
    )
  );

  updateUserSuccess$ = createEffect(() => this.actions$.pipe(ofType(AuthActions.updateUserSuccess)), {
    dispatch: false
  });

  constructor(
    private actions$: Actions,
    private readonly store: Store<AppState>,
    private readonly authService: AuthService,
    private readonly alertService: TuiAlertService
  ) {}
}
