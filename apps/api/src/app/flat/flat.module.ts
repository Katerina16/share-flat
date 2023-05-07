import { Module } from '@nestjs/common';
import {FlatController} from "./controllers/flat.controller";
import {FlatService} from "./servises/flat.service";
import { ReservationController } from "./controllers/reservation.controller";
import { ReservationService } from "./servises/reservation.service";


@Module({
  imports: [],
  controllers: [FlatController, ReservationController],
  providers: [FlatService, ReservationService],
  exports: []
})
export class FlatModule {}
