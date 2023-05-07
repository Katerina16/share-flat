import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from "@sf/interfaces/modules/flat/dto/create.reservation.dto";
import { FlatService } from "./flat.service";
import { ReservationEntity } from "@sf/interfaces/modules/flat/entities/reservation.entity";
import { UserEntity } from "@sf/interfaces/modules/user/entities/user.entity";


@Injectable()
export class ReservationService {
  constructor(private readonly flatService: FlatService) {
  }

  async reservation(userId: number, reservation: CreateReservationDto): Promise<void> {

    const flatData = reservation.flat || reservation.sharedFlat;

    const flat = this.flatService.findById(flatData.id);

    if (userId === (await flat).user.id) {
      throw new ForbiddenException('Нельзя забронировать вашу квартиру');
    }

    reservation.user = { id: userId } as UserEntity

    await ReservationEntity.insert(reservation);

  }
}
