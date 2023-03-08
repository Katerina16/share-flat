import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {CreateUserDto} from "@sf/interfaces/modules/user/dto/create.user.dto";
import {LoginUserDto} from "@sf/interfaces/modules/user/dto/login.user.dto";
import {UserCryptoService} from "../user/user.crypto.service";
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import {TokenService} from "../token/token.service";
import {AuthUserInterface} from "@sf/interfaces/modules/user/interfaces/auth.user.interface";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              private readonly tokenService: TokenService
  ) {
  }

  async registerUser(dto: CreateUserDto): Promise<CreateUserDto> {
    const existsUser = await this.userService.findUserByEmail(dto.email);

    if (existsUser) {
      throw new BadRequestException('Пользователь уже существует');
    }

    return this.userService.create(dto);
  }

  async login(login: LoginUserDto): Promise<AuthUserInterface> {
    const existsUser = await this.userService.findUserByEmail(login.email);

    if (!existsUser) {
      throw new BadRequestException('Пользователь не существует');
    }

    const hash = UserCryptoService.encrypt(login.password);

    if (hash !== existsUser.password) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    delete existsUser.password;

    const token = await this.tokenService.generateJwtToken({ id: existsUser.id, email: existsUser.email } as UserEntity);

    return { user: existsUser, token };
  }
}
