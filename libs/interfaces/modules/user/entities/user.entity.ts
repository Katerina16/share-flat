import {Entity, Column, PrimaryGeneratedColumn, Index, BaseEntity, OneToMany} from 'typeorm';
import {FlatEntity} from "@sf/interfaces/modules/flat/entities/flat.entity";
import {ReviewEntity} from "@sf/interfaces/modules/flat/entities/review.entity";
import {MessageEntity} from "@sf/interfaces/modules/flat/entities/message.entity";
import { ReservationEntity } from "@sf/interfaces/modules/flat/entities/reservation.entity";

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying', {
    name: 'first_name'
  })
  firstName: string;

  @Column('character varying', {
    name: 'last_name'
  })
  lastName: string;

  @Column('character varying', {
    name: 'middle_name'
  })
  middleName: string;

  @Index('userEmailIndex', { unique: true })
  @Column('text', {
    nullable: false
  })
  email: string;

  @Column('character varying', {
    nullable: false,
  })
  password: string;

  @Column('character varying', {
    nullable: false,
  })
  phone: string;

  @Column('timestamp without time zone', {
    default: () => '(now() at time zone \'Europe/Moscow\')'
  })
  created: Date;

  @Column({ type: 'date', name: 'birth_date' })
  birthDate: Date;

  @Column({ default: false, name: 'is_admin' })
  isAdmin?: boolean;

  @OneToMany(() => FlatEntity, (flats) => flats.user)
  flats: FlatEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user)
  reservations: ReservationEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];
}
