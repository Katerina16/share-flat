import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUserDto } from '@sf/interfaces/modules/user/dto/create.user.dto';
import { LoginUserDto } from '@sf/interfaces/modules/user/dto/login.user.dto';
import { map, Observable, of } from 'rxjs';
import { AuthUser, User } from '../store/auth/reducers';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(loginData: LoginUserDto): Observable<AuthUser> {
    return this.http.post<AuthUser>('/auth/login', loginData);
  }

  register(registerData: CreateUserDto): Observable<void> {
    return this.http.post<void>('/auth/register', registerData);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/user/current');
  }

  updateUser(user: Partial<User>): Observable<void> {
    return this.http.put<void>('/user', user);
  }

  isLoggedIn(): Observable<boolean> {
    if (localStorage.getItem('token')) {
      return this.getCurrentUser().pipe(map(Boolean));
    }
    return of(false);
  }
}
