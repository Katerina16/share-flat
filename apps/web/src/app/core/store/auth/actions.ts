import { createAction, props } from '@ngrx/store';
import { CreateUserDto } from '@sf/interfaces/modules/user/dto/create.user.dto';
import { LoginUserDto } from '@sf/interfaces/modules/user/dto/login.user.dto';
import { AuthUser, User } from './reducers';


export const login = createAction('[Auth] login', props<{ data: LoginUserDto }>());
export const loginSuccess = createAction('[Auth] login success', props<AuthUser>());
export const loginFail = createAction('[Auth] login fail');

export const logout = createAction('[Auth] logout');

export const register = createAction('[Auth] register', props<{ data: CreateUserDto }>());
export const registerSuccess = createAction('[Auth] register success');
export const registerFail = createAction('[Auth] register fail');

export const tryGetCurrentUser = createAction('[Auth] try get current user');
export const getCurrentUser = createAction('[Auth] get current user');
export const getCurrentUserSuccess = createAction(
  '[Auth] get current user success',
  props<{ user: User }>()
);
export const getCurrentUserFail = createAction('[Auth] get current user fail');
