import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from "@sf/interfaces/modules/flat/dto/create.reservation.dto";
import { ReservationEntity } from "@sf/interfaces/modules/flat/entities/reservation.entity";
import { UserEntity } from "@sf/interfaces/modules/user/entities/user.entity";
import * as dateFns from 'date-fns'
import { FlatEntity } from "@sf/interfaces/modules/flat/entities/flat.entity";


@Injectable()
export class ReservationService {
  constructor() {
  }

  async find(userId: number, my: boolean): Promise<ReservationEntity[]> {

    const reservations = await ReservationEntity.find({
      relations: ['messages', 'user', 'flat', 'flat.user']
    });

    return reservations.filter(reservation => {
      if (my) {
        return reservation.user.id === userId;
      } else  {
        return reservation.flat.user.id === userId;
      }
    });
  }

  async reservation(userId: number, reservation: CreateReservationDto): Promise<void> {

    const flatData = reservation.flat || reservation.sharedFlat;

    const flat = await FlatEntity.findOne({
      where: { id: flatData.id },
      relations: ['reservations', 'user']
    });

    if (userId === flat.user.id) {
      throw new ForbiddenException('Нельзя забронировать вашу квартиру');
    }

    reservation.user = { id: userId } as UserEntity;

    for (const flatReservation of flat.reservations) {
      if (!(dateFns.isBefore(new Date(reservation.to), new Date(flatReservation.from))
        || dateFns.isAfter(new Date(reservation.from), new Date(flatReservation.to))
      )) {
        throw new BadRequestException('Квартира уже забронирована на эти даты');
      }
    }

    await ReservationEntity.insert(reservation);

  }
}
