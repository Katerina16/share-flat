import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './actions';

export interface User {
  id: number,
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  created: Date;
  birthDate: Date;
  isAdmin: boolean;
}

export interface AuthUser {
  user: User,
  token: string;
}

export interface AuthState {
  loading: boolean,
  token: string | null,
  user: User | null
}

const initialState: AuthState = {
  loading: false,
  token: localStorage.getItem('token'),
  user: null
};

export const authReducers = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.getCurrentUser, AuthActions.register, state => ({ ...state, loading: true })),
  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    loading: false,
    token: action.token,
    user: action.user
  })),
  on(AuthActions.getCurrentUserSuccess, (state, action) => ({ ...state, user: action.user, loading: false })),
  on(
    AuthActions.registerSuccess,
    AuthActions.registerFail,
    AuthActions.loginFail,
    AuthActions.getCurrentUserFail,
    state => ({ ...state, loading: false })
  ),
  on(AuthActions.logout, state => ({ ...state, user: null, token: null, loading: false }))
);
