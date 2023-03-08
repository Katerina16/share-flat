import { IsEmail, IsNotEmpty } from 'class-validator';
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";

export class LoginUserDto implements Partial<UserEntity> {

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  @IsEmail({
    allow_display_name: false
  }, {
    message: 'Некорректно заполнено поле $property',
  })
  email: string;

  @IsNotEmpty({
    message: 'Не заполнено поле $property'
  })
  password: string;
}
