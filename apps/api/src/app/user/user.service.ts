import {BadRequestException, Injectable} from '@nestjs/common';
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import {CreateUserDto} from "@sf/interfaces/modules/user/dto/create.user.dto";
import {UserCryptoService} from "./user.crypto.service";
import {UpdateUserDto} from "@sf/interfaces/modules/user/dto/update.user.dto";


@Injectable()
export class UserService {

  async getUserById(id: number): Promise<UserEntity> {
    return UserEntity.findOne({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return UserEntity.findOne({ where: { email } });
  }

  async create(user: CreateUserDto): Promise<UserEntity> {

    user.password = UserCryptoService.encrypt(user.password);

    return UserEntity.create<UserEntity>(user).save();

  }

  async update(id: number, user: UpdateUserDto): Promise<UserEntity> {
    const existsUser = await this.findUserByEmail(user.email);

    if (existsUser) {
      throw new BadRequestException('Пользователь уже существует');
    }

    await UserEntity.update(id, user);

    return this.getUserById(id);

  }
}
