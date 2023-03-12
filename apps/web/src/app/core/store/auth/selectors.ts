import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';

const authFeature = (state: AppState) => state.auth;

export const selectCurrentUser = createSelector(authFeature, state => state.user);
export const selectLoading = createSelector(authFeature, state => state.loading);
export const selectToken = createSelector(authFeature, state => state.token);
