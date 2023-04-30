import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import {PropertyValueEntity} from "@sf/interfaces/modules/flat/entities/property.value.entity";
import {ReviewEntity} from "@sf/interfaces/modules/flat/entities/review.entity";
import {FreeDateEntity} from "@sf/interfaces/modules/flat/entities/free.date.entity";
import {ReservationEntity} from "@sf/interfaces/modules/flat/entities/reservation.entity";

@Entity('flat')
export class FlatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying')
  name: string;

  @Column('timestamp without time zone', {
    default: () => '(now() at time zone \'Europe/Moscow\')'
  })
  created: Date;

  @Column('boolean', { default: false })
  deleted: boolean;

  @Column('character varying')
  address: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('float')
  square: number;

  @Column('int')
  floor: number;

  @Column('int')
  floors: number;

  @Column('text')
  description: string;

  @Column('int')
  price: number;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  shared: boolean;

  @Column('int')
  rooms: number;

  @Column('int')
  guests: number;

  @Column('character varying', { array: true, nullable: true, default: [] })
  photos: string[];

  @ManyToOne(() => UserEntity, (user) => user.flats)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id'
  })
  user: UserEntity;

  @OneToMany(() => PropertyValueEntity, (propertyValue) => propertyValue.flat)
  propertyValues: PropertyValueEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.flat)
  reviews: ReviewEntity[];

  @OneToMany(() => FreeDateEntity, (freeDate) => freeDate.flat)
  freeDates: FreeDateEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.flat)
  reservations: ReservationEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.sharedFlat)
  sharedReservations: ReservationEntity[];

}
