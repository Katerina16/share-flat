import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {CityService} from "./city.service";
import {CreateCityDto} from "@sf/interfaces/modules/city/dto/create.city.dto";
import {JwtGuard} from "../../guards/jwt.guard";
import {RoleGuard} from "../../guards/role.guard";
import {CityEntity} from "@sf/interfaces/modules/city/entities/city.entity";


@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  find(): Promise<CityEntity[]> {
    return this.cityService.find();
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  create(@Body() city: CreateCityDto): Promise<CityEntity> {
    return this.cityService.create(city);
  }
}
