import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CityEntity } from "@sf/interfaces/modules/city/entities/city.entity";
import { FlatEntity } from "@sf/interfaces/modules/flat/entities/flat.entity";
import { FreeDateEntity } from "@sf/interfaces/modules/flat/entities/free.date.entity";
import { MessageEntity } from "@sf/interfaces/modules/flat/entities/message.entity";
import { PropertyEntity } from "@sf/interfaces/modules/flat/entities/property.entity";
import { PropertyValueEntity } from "@sf/interfaces/modules/flat/entities/property.value.entity";
import { ReservationEntity } from "@sf/interfaces/modules/flat/entities/reservation.entity";
import { ReviewEntity } from "@sf/interfaces/modules/flat/entities/review.entity";
import { UserEntity } from "@sf/interfaces/modules/user/entities/user.entity";
import { join } from 'path';
import config from '../config';
import { AuthModule } from "./auth/auth.module";
import { CityModule } from "./city/city.module";
import { FlatModule } from './flat/flat.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'photos'),
      serveRoot: '/api/photos'
    }),
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
    TokenModule,
    CityModule,
    FlatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
