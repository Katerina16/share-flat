import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { Observable } from 'rxjs';
import { MessageEntity } from '@sf/interfaces/modules/flat/entities/message.entity';

export interface ReservationCreateData {
  from: Date;
  to: Date;
  flat: { id: number };
  sharedFlat: { id: number } | undefined;
}

export interface MessageCreateData {
  text: string;
  reservation: { id: number };
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  readonly baseUrl = '/reservation';

  constructor(private readonly http: HttpClient) {}

  getReservation(reservationId: string | number): Observable<ReservationEntity> {
    return this.http.get<ReservationEntity>(`${this.baseUrl}/${reservationId}`);
  }

  getReservations(params?: { my: boolean }): Observable<ReservationEntity[]> {
    return this.http.get<ReservationEntity[]>(this.baseUrl, { params });
  }

  changeStatus(id: number, confirmed: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, { confirmed });
  }

  createReservation(data: ReservationCreateData): Observable<ReservationEntity> {
    return this.http.post<ReservationEntity>(this.baseUrl, data);
  }

  getMessages(reservationId: string | number): Observable<MessageEntity[]> {
    return this.http.get<MessageEntity[]>(`/message/${reservationId}`);
  }

  createMessage(data: MessageCreateData): Observable<MessageEntity> {
    return this.http.post<MessageEntity>('/message', data);
  }
}
