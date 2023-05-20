import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { HttpClient } from '@angular/common/http';
import { TuiCarouselModule, TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { ReservationIslandComponent } from '../../ui/reservation-island/reservation-island.component';

@Component({
  selector: 'sf-reservation-list',
  standalone: true,
  imports: [CommonModule, TuiCarouselModule, RouterLink, TuiIslandModule, TuiTagModule, ReservationIslandComponent],
  templateUrl: './reservation-list.component.html'
})
export class ReservationListComponent {
  reservations$ = this.http.get<ReservationEntity[]>('/reservation', { params: { my: 'true' } });

  constructor(private readonly http: HttpClient) {}
}
