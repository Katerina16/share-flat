import { Module } from '@nestjs/common';
import {UserModule} from "./user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import {AuthModule} from "./auth/auth.module";
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: '',
      password: '',
      database: 'share_flat',
      entities: [UserEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    TokenModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
