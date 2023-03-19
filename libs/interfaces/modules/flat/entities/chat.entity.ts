import {Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany} from 'typeorm';
import {MessageEntity} from "@sf/interfaces/modules/flat/entities/message.entity";

@Entity('chat')
export class ChatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

}
