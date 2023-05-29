import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FlatEntity } from "@sf/interfaces/modules/flat/entities/flat.entity";
import { PropertyValueEntity } from "@sf/interfaces/modules/flat/entities/property.value.entity";
import { UserEntity } from "@sf/interfaces/modules/user/entities/user.entity";
import { CityEntity } from "@sf/interfaces/modules/city/entities/city.entity";
import { ReservationEntity } from "@sf/interfaces/modules/flat/entities/reservation.entity";

export class CreateFlatDto implements Partial<FlatEntity> {
  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  @IsString()
  name: string;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  address: string;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  latitude: number;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  longitude: number;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  square: number;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  floor: number;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  floors: number;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  description: string;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  price: number;

  @IsOptional()
  shared: boolean;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  rooms: number;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  guests: number;

  photos: string[];

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  propertyValues: PropertyValueEntity[];

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  city: CityEntity;

  @IsOptional()
  user: UserEntity;

  @IsOptional()
  reservations: ReservationEntity[];

}
