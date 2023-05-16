import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { HttpClient } from '@angular/common/http';
import { TuiCarouselModule, TuiIslandModule } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

@Component({
  selector: 'sf-reservation-list',
  standalone: true,
  imports: [CommonModule, TuiCarouselModule, RouterLink, TuiIslandModule],
  templateUrl: './reservation-list.component.html'
})
export class ReservationListComponent {
  reservations$ = this.http.get<ReservationEntity[]>('/reservation', { params: { my: 'true' } }).pipe(
    tap((reservations) => {
      this.imageIndexes = reservations.reduce((res, reservation) => {
        res[reservation.id] = 0;
        return res;
      }, this.imageIndexes);
    })
  );

  imageIndexes: Record<number, number> = {};

  constructor(private readonly http: HttpClient) {}

  reservationFullPrice(reservation: ReservationEntity): number {
    return (
      (differenceInCalendarDays(new Date(reservation.to), new Date(reservation.from)) + 1) * reservation.flat.price
    );
  }
}
