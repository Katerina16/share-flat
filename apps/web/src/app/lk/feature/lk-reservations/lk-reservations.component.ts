import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { ReservationIslandComponent } from '../../../reservation/ui/reservation-island/reservation-island.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sf-lk-reservations',
  standalone: true,
  imports: [CommonModule, ReservationIslandComponent, RouterLink],
  templateUrl: './lk-reservations.component.html'
})
export class LkReservationsComponent {
  reservations$ = this.http.get<ReservationEntity[]>('/reservation', { params: { my: true } });

  constructor(private readonly http: HttpClient) {}
}
