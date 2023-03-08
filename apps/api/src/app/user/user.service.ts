import {Injectable} from '@nestjs/common';
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import {CreateUserDto} from "@sf/interfaces/modules/user/dto/create.user.dto";
import {UserCryptoService} from "./user.crypto.service";


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

    return await UserEntity.create<UserEntity>(user).save();

  }
}
