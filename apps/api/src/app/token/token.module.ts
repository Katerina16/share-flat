import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import {JwtModule} from "@nestjs/jwt";

@Module({
  providers: [TokenService, JwtModule],
  exports: [TokenService],
  imports: [JwtModule]
})
export class TokenModule {}
