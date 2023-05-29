import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  readonly baseUrl = '/reservation';

  constructor(private readonly http: HttpClient) {}

  getReservations(params?: { my: boolean }): Observable<ReservationEntity[]> {
    return this.http.get<ReservationEntity[]>(this.baseUrl, { params });
  }

  changeStatus(id: number, confirmed: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, { confirmed });
  }
}
