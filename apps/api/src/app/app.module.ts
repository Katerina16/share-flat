import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@sf/interfaces/modules/user/entities/user.entity";
import config from '../config';
import { AuthModule } from "./auth/auth.module";
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import {CityEntity} from "@sf/interfaces/modules/city/entities/city.entity";
import {FlatEntity} from "@sf/interfaces/modules/flat/entities/flat.entity";
import {PropertyValueEntity} from "@sf/interfaces/modules/flat/entities/property.value.entity";
import {PropertyEntity} from "@sf/interfaces/modules/flat/entities/property.entity";
import {FreeDateEntity} from "@sf/interfaces/modules/flat/entities/free.date.entity";
import {ChatEntity} from "@sf/interfaces/modules/flat/entities/chat.entity";
import {MessageEntity} from "@sf/interfaces/modules/flat/entities/message.entity";
import {ReservationEntity} from "@sf/interfaces/modules/flat/entities/reservation.entity";
import {ReviewEntity} from "@sf/interfaces/modules/flat/entities/review.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [
          UserEntity,
          CityEntity,
          FlatEntity,
          PropertyValueEntity,
          PropertyEntity,
          FreeDateEntity,
          ChatEntity,
          MessageEntity,
          ReservationEntity,
          ReviewEntity,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    TokenModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
