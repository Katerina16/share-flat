import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateCityDto } from "@sf/interfaces/modules/city/dto/create.city.dto";
import { CityEntity } from "@sf/interfaces/modules/city/entities/city.entity";
import { JwtGuard } from "../../guards/jwt.guard";
import { CityService } from "./city.service";


@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) { }

  @Get()
  find(): Promise<CityEntity[]> {
    return this.cityService.find();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() city: CreateCityDto): Promise<CityEntity> {
    return this.cityService.create(city);
  }
}
