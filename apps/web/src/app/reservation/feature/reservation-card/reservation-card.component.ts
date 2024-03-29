import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservationIslandComponent } from '../../ui/reservation-island/reservation-island.component';
import { TuiIslandModule, TuiRatingModule, TuiTextAreaModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiFormatPhonePipeModule, TuiSvgModule } from '@taiga-ui/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageEntity } from '@sf/interfaces/modules/flat/entities/message.entity';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/reducers';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { ReviewEntity } from '@sf/interfaces/modules/flat/entities/review.entity';
import { User } from '../../../core/store/auth/reducers';
import { combineLatest } from 'rxjs';
import { AuthEffects } from '../../../core/store/auth/effects';
import { ReservationService } from '../../../core/services/reservation.service';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'sf-reservation-card',
  standalone: true,
  imports: [
    CommonModule,
    ReservationIslandComponent,
    TuiIslandModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiFormatPhonePipeModule,
    RouterLink,
    TuiTextAreaModule,
    ReactiveFormsModule,
    TuiMapperPipeModule,
    TuiRatingModule,
    FormsModule
  ],
  templateUrl: './reservation-card.component.html'
})
export class ReservationCardComponent implements OnInit {
  reservation: ReservationEntity;

  messages: MessageEntity[] = [];
  messageControl = new FormControl('', [Validators.required, Validators.minLength(1)]);

  currentUser: User;
  currentUserReview: ReviewEntity;
  canLeaveReview: boolean;

  reviewForm: FormGroup;

  readonly mapper = (messages: MessageEntity[]): MessageEntity[] =>
    messages.sort((a, b) => {
      return a.date < b.date ? -1 : 1;
    });

  constructor(
    private readonly reservationService: ReservationService,
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly fb: FormBuilder,
    private readonly authEffects: AuthEffects,
    private readonly router: Router,
    private readonly reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const reservationId = this.route.snapshot.params['id'];
    combineLatest([
      this.store.select(selectCurrentUser),
      this.reservationService.getReservation(reservationId)
    ]).subscribe(([user, reservation]) => {
      this.reservation = reservation;
      this.currentUser = user as User;

      const reservationEnded = Date.now() > new Date(reservation.to).getTime();

      if (this.reservation.sharedFlat) {
        this.canLeaveReview = reservationEnded;
        if (this.reservation.flat.user.id !== user?.id) {
          this.currentUserReview = this.reservation.flat.reviews[0];
        } else if (this.reservation.sharedFlat.user.id !== user?.id) {
          this.currentUserReview = this.reservation.sharedFlat.reviews[0];
        }
      } else {
        this.canLeaveReview = this.reservation.flat.user.id !== this.currentUser.id && reservationEnded;
        if (this.canLeaveReview) {
          this.currentUserReview = this.reservation.flat.reviews[0];
        }
      }

      if (!this.currentUserReview && this.canLeaveReview) {
        this.reviewForm = this.fb.group({
          rating: new FormControl(0, [Validators.required, Validators.min(1)]),
          text: new FormControl('', [Validators.required, Validators.minLength(1)])
        });
      }
    });

    this.reservationService.getMessages(reservationId).subscribe((messages) => {
      this.messages = messages;
    });

    this.authEffects.logout$.subscribe(() => this.router.navigate(['/']));
  }

  sendMessage(): void {
    if (this.messageControl.invalid) {
      return;
    }

    const body = {
      text: this.messageControl.getRawValue() || '',
      reservation: { id: this.reservation.id }
    };
    this.reservationService.createMessage(body).subscribe((message) => {
      this.messages.push(message);
      this.messageControl.reset();
    });
  }

  addReview(): void {
    if (this.reviewForm.invalid) {
      return;
    }

    const reviewFlat =
      this.reservation.flat.user.id === this.currentUser?.id ? this.reservation.sharedFlat : this.reservation.flat;

    const body = {
      ...this.reviewForm.getRawValue(),
      flat: { id: reviewFlat.id }
    };
    
    this.reviewService.createReview(body).subscribe((review) => {
      this.currentUserReview = review;
    });
  }
}
