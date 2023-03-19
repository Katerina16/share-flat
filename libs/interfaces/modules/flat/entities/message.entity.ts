import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import {ChatEntity} from "@sf/interfaces/modules/flat/entities/chat.entity";

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

  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  @JoinColumn({
    name: 'chat_id',
    referencedColumnName: 'id'
  })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id'
  })
  user: UserEntity;

}
