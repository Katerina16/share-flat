import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiCarouselModule, TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { ReservationIslandComponent } from '../../ui/reservation-island/reservation-island.component';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'sf-reservation-list',
  standalone: true,
  imports: [CommonModule, TuiCarouselModule, RouterLink, TuiIslandModule, TuiTagModule, ReservationIslandComponent],
  templateUrl: './reservation-list.component.html'
})
export class ReservationListComponent {
  reservations$ = this.reservationService.getReservations({ my: true });

  constructor(private readonly reservationService: ReservationService) {}
}
