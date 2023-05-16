import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { ReviewEntity } from '@sf/interfaces/modules/flat/entities/review.entity';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import {
  TuiCarouselModule,
  TuiCheckboxLabeledModule,
  TuiInputDateRangeModule,
  TuiIslandModule,
  TuiPaginationModule
} from '@taiga-ui/kit';
import { combineLatest, map, Observable, shareReplay, switchMap } from 'rxjs';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { AppState } from '../../../core/store/reducers';
import { TuiDayRange, TuiFilterPipeModule, TuiMatcher } from '@taiga-ui/cdk';
import { PropertyValueEntity } from '@sf/interfaces/modules/flat/entities/property.value.entity';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { LoginButtonComponent } from '../../../shared/login-button/login-button.component';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';

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
    TuiFilterPipeModule,
    TuiInputDateRangeModule,
    FormsModule,
    ReactiveFormsModule,
    TuiCheckboxLabeledModule,
    LoginButtonComponent
  ],
  templateUrl: './flat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatCardComponent implements OnInit {
  imageIndex = 0;

  flat$: Observable<FlatEntity>;
  flatId: number;
  isOwnFlat$: Observable<boolean>;
  user$ = this.store.select(selectCurrentUser);

  reviews$: Observable<ReviewEntity[]>;
  reviewsCount$: Observable<number>;
  reviewsRating$: Observable<number>;

  reservation: {
    dates: TuiDayRange | null;
    flat?: FlatEntity;
    shared: boolean;
    sharedFlat?: FlatEntity;
  } = {
      dates: null,
      shared: false
    };

  propFilter: TuiMatcher<PropertyValueEntity> = (prop: PropertyValueEntity) => prop.value;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.flat$ = this.route.params.pipe(
      switchMap((params) => {
        this.flatId = +params['id'];
        return this.http.get<FlatEntity>(`/flat/${this.flatId}`);
      }),
      shareReplay(1)
    );

    this.isOwnFlat$ = combineLatest([this.flat$, this.user$]).pipe(map(([flat, user]) => flat.user.id === user?.id));

    this.reviews$ = this.route.params.pipe(
      switchMap(params => this.http.get<ReviewEntity[]>(`/review/${params['id']}`)),
      shareReplay(1)
    );

    this.reviewsCount$ = this.reviews$.pipe(map(reviews => reviews.length));

    this.reviewsRating$ = this.reviews$.pipe(
      map(reviews => reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
    );
  }

  getReservationDaysCount(): number {
    return this.reservation.dates
      ? differenceInCalendarDays(
        this.reservation.dates.to.toUtcNativeDate(),
        this.reservation.dates.from.toUtcNativeDate()
      ) + 1
      : 0;
  }

  reserve(): void {
    const data = {
      from: this.reservation.dates?.from.toUtcNativeDate(),
      to: this.reservation.dates?.to.toUtcNativeDate(),
      flat: { id: this.flatId },
      sharedFlat: this.reservation.sharedFlat
    };

    this.http.post<ReservationEntity>('/reservation', data).subscribe((reservation) => {
      this.router.navigate(['/reservation/card', reservation.id]).catch(console.error);
    });
  }
}
