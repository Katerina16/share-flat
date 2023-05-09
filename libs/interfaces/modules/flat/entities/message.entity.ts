import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import { ReservationEntity } from "@sf/interfaces/modules/flat/entities/reservation.entity";

@Entity('message')
export class MessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp without time zone', {
    default: () => '(now() at time zone \'Europe/Moscow\')'
  })
  date: Date;

  @Column('text')
  text: string;

  @ManyToOne(() => ReservationEntity, (reservation) => reservation.messages)
  @JoinColumn({
    name: 'reservation_id',
    referencedColumnName: 'id'
  })
  reservation: ReservationEntity;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id'
  })
  user: UserEntity;

}
