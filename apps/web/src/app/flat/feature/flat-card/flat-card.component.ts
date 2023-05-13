import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { ReviewEntity } from '@sf/interfaces/modules/flat/entities/review.entity';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiCarouselModule, TuiIslandModule, TuiPaginationModule } from '@taiga-ui/kit';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { AppState } from '../../../core/store/reducers';
import { TuiFilterPipeModule, TuiMatcher } from '@taiga-ui/cdk';
import { PropertyValueEntity } from '@sf/interfaces/modules/flat/entities/property.value.entity';

@Component({
  selector: 'sf-flat-card',
  standalone: true,
  imports: [
    CommonModule,
    TuiCarouselModule,
    TuiPaginationModule,
    TuiSvgModule,
    TuiIslandModule,
    TuiButtonModule,
    RouterModule,
    TuiFilterPipeModule
  ],
  templateUrl: './flat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatCardComponent implements OnInit {
  imageIndex = 0;

  flat$: Observable<FlatEntity>;
  isOwnFlat$: Observable<boolean>;

  reviews$: Observable<ReviewEntity[]>;
  reviewsCount$: Observable<number>;
  reviewsRating$: Observable<number>;

  propFilter: TuiMatcher<PropertyValueEntity> = (prop: PropertyValueEntity) => prop.value;

  constructor(private http: HttpClient, private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.flat$ = this.route.params.pipe(switchMap(params => this.http.get<FlatEntity>(`/flat/${params['id']}`)));

    this.isOwnFlat$ = combineLatest([this.flat$, this.store.select(selectCurrentUser)]).pipe(
      map(([flat, user]) => flat.user.id === user?.id)
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
