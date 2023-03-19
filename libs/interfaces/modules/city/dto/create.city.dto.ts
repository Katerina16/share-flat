import {IsNotEmpty} from 'class-validator';
import {CityEntity} from "@sf/interfaces/modules/city/entities/city.entity";


export class CreateCityDto implements Partial<CityEntity> {
  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  name: string;
}
