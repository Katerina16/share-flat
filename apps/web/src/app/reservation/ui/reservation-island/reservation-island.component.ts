import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiCarouselModule, TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sf-reservation-island',
  standalone: true,
  imports: [CommonModule, TuiCarouselModule, TuiIslandModule, TuiTagModule, RouterLink],
  templateUrl: './reservation-island.component.html'
})
export class ReservationIslandComponent {
  @Input() reservation: ReservationEntity;
  @Input() flatField: 'flat' | 'sharedFlat' = 'flat';
  @Input() showShared = false;
  imageIndex = 0;

  reservationFullPrice(reservation: ReservationEntity): number {
    return (
      (differenceInCalendarDays(new Date(reservation.to), new Date(reservation.from)) + 1) * reservation.flat.price
    );
  }
}
