import { IsBoolean } from "class-validator";
import { ReservationEntity } from "@sf/interfaces/modules/flat/entities/reservation.entity";

export class ConfirmReservationDto implements Partial<ReservationEntity> {

  @IsBoolean()
  confirmed: boolean

}
