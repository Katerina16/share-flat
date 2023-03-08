import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {
  }

  async generateJwtToken(user: UserEntity): Promise<string>{

    return this.jwtService.sign(user, {
      secret: 'shareFlatSecretKey',
      expiresIn: '3h'
    })

  }
}
