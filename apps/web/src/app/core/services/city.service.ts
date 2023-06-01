import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CityEntity } from '@sf/interfaces/modules/city/entities/city.entity';

@Injectable({ providedIn: 'root' })
export class CityService {
  constructor(private readonly http: HttpClient) {}

  getCities(): Observable<CityEntity[]> {
    return this.http.get<CityEntity[]>('/city');
  }
}
