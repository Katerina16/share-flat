import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TokenService {
  constructor(
  private readonly jwtService: JwtService,
  private readonly configService: ConfigService
  ) {
  }

  async generateJwtToken(user: UserEntity): Promise<string>{

    return this.jwtService.sign(user, {
      secret: this.configService.get('jwt_secret'),
      expiresIn: this.configService.get('jwt_exp')
    })

  }
}
