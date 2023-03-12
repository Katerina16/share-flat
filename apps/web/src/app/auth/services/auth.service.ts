import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUserDto } from '@sf/interfaces/modules/user/dto/create.user.dto';
import { LoginUserDto } from '@sf/interfaces/modules/user/dto/login.user.dto';
import { Observable } from 'rxjs';
import { AuthUser, User } from '../../core/store/auth/reducers';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) { }

  login(loginData: LoginUserDto): Observable<AuthUser> {
    return this.http.post<AuthUser>('/api/auth/login', loginData);
  }

  register(registerData: CreateUserDto): Observable<void> {
    return this.http.post<void>('/api/auth/register', registerData);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/user/current');
  }
}
