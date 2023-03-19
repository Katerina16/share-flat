import { Injectable} from '@nestjs/common';
import {CityEntity} from "@sf/interfaces/modules/city/entities/city.entity";
import {CreateCityDto} from "@sf/interfaces/modules/city/dto/create.city.dto";


@Injectable()
export class CityService {

  async find(): Promise<CityEntity[]> {
    return CityEntity.find()
  }

  async create(city: CreateCityDto): Promise<CityEntity> {
    return CityEntity.create<CityEntity>(city).save()
  }
}
