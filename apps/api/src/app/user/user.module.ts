import { Module } from '@nestjs/common';
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {UserCryptoService} from "./user.crypto.service";


@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserCryptoService,],
  exports: [UserService]
})
export class UserModule {}
