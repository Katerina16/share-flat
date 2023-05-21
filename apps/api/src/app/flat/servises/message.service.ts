import { Injectable } from '@nestjs/common';
import { UserEntity } from "@sf/interfaces/modules/user/entities/user.entity";
import { CreateMessageDto } from "@sf/interfaces/modules/flat/dto/create.message.dto";
import { MessageEntity } from "@sf/interfaces/modules/flat/entities/message.entity";


@Injectable()
export class MessageService {
  constructor() {
  }

  async find(reservationId: number): Promise<MessageEntity[]> {
    return MessageEntity.find({
      where: { reservation: { id: reservationId } },
      relations: ['user'],
    });
  }


  async create(userId: number, message: CreateMessageDto): Promise<MessageEntity> {
    message.user = { id: userId } as UserEntity;

    const messageInsert = await MessageEntity.insert(message);

    return MessageEntity.findOne({ where: { id: messageInsert.identifiers[0].id }, relations: ['user'] })
  }
}
