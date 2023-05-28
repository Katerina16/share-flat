import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { ReviewEntity } from '@sf/interfaces/modules/flat/entities/review.entity';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import {
  TuiCarouselModule,
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiInputDateRangeModule,
  TuiIslandModule,
  TuiPaginationModule,
  TuiSelectModule
} from '@taiga-ui/kit';
import { combineLatest, filter, map, Observable, shareReplay, switchMap, take, tap } from 'rxjs';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { AppState } from '../../../core/store/reducers';
import { TuiDay, TuiDayRange, TuiFilterPipeModule, TuiMatcher } from '@taiga-ui/cdk';
import { PropertyValueEntity } from '@sf/interfaces/modules/flat/entities/property.value.entity';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { LoginButtonComponent } from '../../../shared/login-button/login-button.component';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { addDays, isAfter, isBefore, subDays } from 'date-fns';
import { MapComponent } from '../../../shared/map/map.component';

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
    LoginButtonComponent,
    TuiSelectModule,
    TuiDataListWrapperModule,
    MapComponent
  ],
  templateUrl: './flat-card.component.html'
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

  reservations: ReservationEntity[] = [];
  ownFlats: FlatEntity[] = [];
  ownFlatsLoading = false;

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
  ) {
    this.isDateDisabled = this.isDateDisabled.bind(this);
  }

  ngOnInit(): void {
    this.flat$ = this.route.params.pipe(
      switchMap((params) => {
        this.flatId = +params['id'];
        return this.http.get<FlatEntity>(`/flat/${this.flatId}`);
      }),
      tap((flat) => {
        this.reservations = flat.reservations;
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

    this.user$.subscribe(() => this.loadOwnFlats());
  }

  isDateDisabled(day: TuiDay): boolean {
    const date = day.toUtcNativeDate();
    const currentDate = new Date();

    return this.reservations.some((reservation) => {
      return (
        isAfter(currentDate, date) ||
        (isAfter(date, subDays(new Date(reservation.from), 1)) && isBefore(date, addDays(new Date(reservation.to), 1)))
      );
    });
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

  loadOwnFlats(): void {
    if (this.reservation.shared && this.reservation.dates?.from && this.reservation.dates.to) {
      this.user$
        .pipe(
          take(1),
          tap((user) => {
            if (!user) {
              this.ownFlats = [];
            }
          }),
          filter(user => !!user),
          switchMap(() => {
            this.ownFlatsLoading = true;
            const params = {
              from: this.reservation.dates?.from.toUtcNativeDate().toISOString().substring(0, 10),
              to: this.reservation.dates?.to.toUtcNativeDate().toISOString().substring(0, 10),
              shared: true
            };
            return this.http.get<FlatEntity[]>('/flat/my', { params: params as Params });
          })
        )
        .subscribe((ownFlats) => {
          this.ownFlatsLoading = false;
          this.ownFlats = ownFlats.filter(flat => flat.shared);
          this.reservation.sharedFlat = this.ownFlats.length === 1 ? this.ownFlats[0] : undefined;
        });
    }
  }
}
