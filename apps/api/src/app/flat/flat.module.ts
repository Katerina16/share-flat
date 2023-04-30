import { Module } from '@nestjs/common';
import {FlatController} from "./controllers/flat.controller";
import {FlatService} from "./servises/flat.service";


@Module({
  imports: [],
  controllers: [FlatController],
  providers: [FlatService],
  exports: []
})
export class FlatModule {}
