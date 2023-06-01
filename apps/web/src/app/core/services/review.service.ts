import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewEntity } from '@sf/interfaces/modules/flat/entities/review.entity';

export interface CreateReviewData {
  rating: number;
  text: string;
  flat: { id: number };
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  readonly baseUrl = '/review';

  constructor(private readonly http: HttpClient) {}

  getFlatReviews(flatId: number): Observable<ReviewEntity[]> {
    return this.http.get<ReviewEntity[]>(`${this.baseUrl}/${flatId}`);
  }

  createReview(data: CreateReviewData): Observable<ReviewEntity> {
    return this.http.post<ReviewEntity>(this.baseUrl, data);
  }
}
