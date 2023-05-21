import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from '@sf/interfaces/modules/flat/dto/create.reservation.dto';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { UserEntity } from '@sf/interfaces/modules/user/entities/user.entity';
import * as dateFns from 'date-fns';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor() {
  }

  async find(userId: number, my: boolean): Promise<ReservationEntity[]> {
    const where = my
      ? [
        {
          user: { id: userId }
        },
        {
          flat: { user: { id: userId } },
          sharedFlat: Not(IsNull())
        }
      ]
      : [
        {
          flat: { user: { id: userId } }
        },
        {
          flat: { user: { id: userId } },
          sharedFlat: Not(IsNull())
        }
      ];

    const reservations = await ReservationEntity.find({
      relations: ['user', 'flat', 'flat.city', 'flat.reviews', 'flat.reviews.user', 'sharedFlat'],
      where: where
    });

    return reservations.map((reservation) => {
      reservation.flat.reviews.filter((review) => review.user.id === userId);

      return reservation;
    });
  }

  async findById(id: number, userId: number): Promise<ReservationEntity> {
    const reservation = await ReservationEntity.findOne({
      where: { id },
      relations: [
        'flat',
        'flat.user',
        'flat.city',
        'flat.reviews',
        'flat.reviews.user',
        'sharedFlat',
        'sharedFlat.city',
        'sharedFlat.reviews',
        'sharedFlat.reviews.user',
        'sharedFlat.user'
      ]
    });

    reservation.flat.reviews = reservation.flat.reviews.filter((review) => review.user.id === userId);

    if (reservation.sharedFlat) {
      reservation.sharedFlat.reviews = reservation.sharedFlat.reviews.filter((review) => review.user.id === userId);
    }

    return reservation;
  }

  async reservation(userId: number, reservationData: CreateReservationDto): Promise<ReservationEntity> {
    const flatData = reservationData.flat || reservationData.sharedFlat;

    const flat = await FlatEntity.findOne({
      where: { id: flatData.id },
      relations: ['reservations', 'user']
    });

    if (userId === flat.user.id) {
      throw new ForbiddenException('Нельзя забронировать вашу квартиру');
    }

    reservationData.user = { id: userId } as UserEntity;

    for (const flatReservation of flat.reservations) {
      if (
        !(
          dateFns.isBefore(new Date(reservationData.to), new Date(flatReservation.from)) ||
          dateFns.isAfter(new Date(reservationData.from), new Date(flatReservation.to))
        )
      ) {
        throw new BadRequestException('Квартира уже забронирована на эти даты');
      }
    }

    const reservationInsert = await ReservationEntity.insert(reservationData);

    return ReservationEntity.findOne({ where: reservationInsert.identifiers[0].id });
  }
}
