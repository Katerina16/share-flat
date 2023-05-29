import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationIslandComponent } from '../../../reservation/ui/reservation-island/reservation-island.component';
import { RouterLink } from '@angular/router';
import { FlatIslandComponent } from '../../../shared/flat-island/flat-island.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { ReservationService } from '../../../core/services/reservation.service';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { AppState } from '../../../core/store/reducers';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../core/store/auth/selectors';

@Component({
  selector: 'sf-lk-reservations',
  standalone: true,
  imports: [
    CommonModule,
    ReservationIslandComponent,
    RouterLink,
    FlatIslandComponent,
    TuiButtonModule,
    TuiMapperPipeModule
  ],
  templateUrl: './lk-reservations.component.html'
})
export class LkReservationsComponent {
  reservations$ = this.reservationService.getReservations();
  currentUser$ = this.store.select(selectCurrentUser);

  readonly mapper = (reservations: ReservationEntity[] | null): ReservationEntity[] =>
    reservations
      ? reservations.sort((a, b) => {
        return a.from < b.from ? 1 : -1;
      })
      : [];

  constructor(private readonly reservationService: ReservationService, private readonly store: Store<AppState>) {}

  changeStatus(id: number, confirmed: boolean): void {
    this.reservationService.changeStatus(id, confirmed).subscribe(() => {
      this.reservations$ = this.reservationService.getReservations();
    });
  }
}
