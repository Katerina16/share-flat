import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReservationIslandComponent } from '../../ui/reservation-island/reservation-island.component';
import { TuiIslandModule, TuiTextAreaModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiFormatPhonePipeModule, TuiSvgModule } from '@taiga-ui/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageEntity } from '@sf/interfaces/modules/flat/entities/message.entity';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/reducers';
import { selectCurrentUser } from '../../../core/store/auth/selectors';

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
    TuiMapperPipeModule
  ],
  templateUrl: './reservation-card.component.html'
})
export class ReservationCardComponent implements OnInit {
  reservation: ReservationEntity;

  messages: MessageEntity[] = [];
  messageControl = new FormControl('', [Validators.required, Validators.minLength(1)]);

  currentUser$ = this.store.select(selectCurrentUser);

  readonly mapper = (messages: MessageEntity[]): MessageEntity[] =>
    messages.sort((a, b) => {
      return a.date < b.date ? -1 : 1;
    });

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit(): void {
    const reservationId = this.route.snapshot.params['id'];
    this.http.get<ReservationEntity>('/reservation/' + reservationId).subscribe((reservation) => {
      this.reservation = reservation;
    });

    this.http.get<MessageEntity[]>('/message/' + reservationId).subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.messageControl.invalid) {
      return;
    }

    const body = {
      text: this.messageControl.getRawValue(),
      reservation: { id: this.reservation.id }
    };
    this.http.post<MessageEntity>('/message', body).subscribe((message) => {
      this.messages.push(message);
      this.messageControl.reset();
    });
  }
}
