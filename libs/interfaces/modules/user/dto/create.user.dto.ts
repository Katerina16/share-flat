import {IsDate, IsEmail, IsMobilePhone, IsNotEmpty} from 'class-validator';
import {UserEntity} from "../entities/user.entity";


export class CreateUserDto implements Partial<UserEntity> {
  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  firstName: string;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  lastName: string;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  middleName: string;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  password: string;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  @IsEmail({
    allow_display_name: false
  }, {
    message: 'Некорректно заполнено поле $property'
  })
  email: string;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  @IsMobilePhone('ru-RU', {}, {
    message: 'Некорректно заполнено поле $property',
  })
  phone: string;

  @IsDate()
  birthDate: Date;

}
