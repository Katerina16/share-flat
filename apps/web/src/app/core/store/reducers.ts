import { authReducers, AuthState } from './auth/reducers';

export interface AppState {
  auth: AuthState
}

export const appReducers = {
  auth: authReducers
};
