import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import {FlatEntity} from "@sf/interfaces/modules/flat/entities/flat.entity";
import {ChatEntity} from "@sf/interfaces/modules/flat/entities/chat.entity";

@Entity('reservation')
export class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp without time zone', {
    default: () => '(now() at time zone \'Europe/Moscow\')'
  })
  created: Date;

  @Column('timestamp without time zone')
  from: Date;

  @Column('timestamp without time zone')
  to: Date;

  @ManyToOne(() => FlatEntity, (flat) => flat.reservations)
  @JoinColumn({
    name: 'flat_id',
    referencedColumnName: 'id'
  })
  flat: FlatEntity;

  @ManyToOne(() => FlatEntity, (flat) => flat.sharedReservations)
  @JoinColumn({
    name: 'shared_flat_id',
    referencedColumnName: 'id'
  })
  sharedFlat: FlatEntity;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  @JoinColumn({
    name: 'chat_id',
    referencedColumnName: 'id'
  })
  chat: ChatEntity;

}
