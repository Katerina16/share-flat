import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PropertyEntity } from '@sf/interfaces/modules/flat/entities/property.entity';
import { Observable } from 'rxjs';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { Params } from '@angular/router';
import { FlatsData } from '../../flat/models/flats-data.model';

@Injectable({ providedIn: 'root' })
export class FlatService {
  readonly baseUrl = '/flat';

  constructor(private readonly http: HttpClient) {}

  getFlat(flatId: number | string): Observable<FlatEntity> {
    return this.http.get<FlatEntity>(`${this.baseUrl}/${flatId}`);
  }

  getFlats(params: Params): Observable<FlatsData> {
    return this.http.get<FlatsData>(`${this.baseUrl}`, { params });
  }

  getOwnFlats(params?: Params): Observable<FlatEntity[]> {
    return this.http.get<FlatEntity[]>(`${this.baseUrl}/my`, { params });
  }

  createFlat(flat: unknown): Observable<FlatEntity> {
    return this.http.post<FlatEntity>(this.baseUrl, flat);
  }

  updateFlat(flatId: number | string, flat: unknown): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${flatId}`, flat);
  }

  deleteFlat(flatId: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${flatId}`);
  }

  addPhoto(flatId: number, photo: FormData): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${flatId}/photo`, photo);
  }

  deletePhoto(flatId: number | string, photo: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${flatId}/photo/${photo}`);
  }

  getProperties(): Observable<PropertyEntity[]> {
    return this.http.get<PropertyEntity[]>(`${this.baseUrl}/properties`);
  }
}
