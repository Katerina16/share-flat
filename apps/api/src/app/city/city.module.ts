import { Module } from '@nestjs/common';
import {CityController} from "./city.controller";
import {CityService} from "./city.service";


@Module({
  imports: [],
  controllers: [CityController],
  providers: [CityService],
  exports: []
})
export class CityModule {}
