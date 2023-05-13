import { Module } from '@nestjs/common';
import {FlatController} from "./controllers/flat.controller";
import {FlatService} from "./servises/flat.service";
import { ReservationController } from "./controllers/reservation.controller";
import { ReservationService } from "./servises/reservation.service";
import { ReviewController } from "./controllers/review.controller";
import { ReviewService } from "./servises/review.service";
import { MessageController } from "./controllers/message.controller";
import { MessageService } from "./servises/message.service";


@Module({
  imports: [],
  controllers: [FlatController, ReservationController, ReviewController, MessageController],
  providers: [FlatService, ReservationService, ReviewService, MessageService],
  exports: []
})
export class FlatModule {}
