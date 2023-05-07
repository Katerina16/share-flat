import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { ReviewEntity } from '@sf/interfaces/modules/flat/entities/review.entity';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiCarouselModule, TuiIslandModule, TuiPaginationModule } from '@taiga-ui/kit';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'sf-flat-card',
  standalone: true,
  imports: [CommonModule, TuiCarouselModule, TuiPaginationModule, TuiSvgModule, TuiIslandModule],
  templateUrl: './flat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatCardComponent implements OnInit {

  imageIndex = 0;
  flat$: Observable<FlatEntity>;
  reviews$: Observable<ReviewEntity[]>;
  reviewsCount$: Observable<number>;
  reviewsRating$: Observable<number>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.flat$ = this.route.params.pipe(
      switchMap(params => this.http.get<FlatEntity>(`/flat/${params['id']}`))
    );

    this.reviews$ = this.route.params.pipe(
      // switchMap(params => this.http.get<ReviewEntity[]>(`/flat/${params['id']}/reviews`)),
      map(() => [
        <ReviewEntity>{ text: '', rating: 5 },
        <ReviewEntity>{ text: '', rating: 2 },
        <ReviewEntity>{ text: '', rating: 4 }
      ])
    );

    this.reviewsCount$ = this.reviews$.pipe(map(reviews => reviews.length));

    this.reviewsRating$ = this.reviews$.pipe(
      map(reviews => reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
    );
  }
}
