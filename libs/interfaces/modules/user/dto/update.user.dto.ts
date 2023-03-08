import {IsDate, IsEmail, IsMobilePhone, IsOptional} from 'class-validator';
import {UserEntity} from "../entities/user.entity";


export class UpdateUserDto implements Partial<UserEntity> {

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  middleName: string;

  @IsOptional()
  @IsEmail({
    allow_display_name: false
  }, {
    message: 'Некорректно заполнено поле $property'
  })
  email: string;

  @IsOptional()
  @IsMobilePhone('ru-RU', {}, {
    message: 'Некорректно заполнено поле $property',
  })
  phone: string;

  @IsOptional()
  @IsDate()
  birthDate: Date;

}
