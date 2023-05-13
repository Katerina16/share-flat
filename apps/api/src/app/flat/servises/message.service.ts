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
    });
  }


  async create(userId: number, message: CreateMessageDto): Promise<void> {
    message.user = { id: userId } as UserEntity;

    await MessageEntity.insert(message);
  }
}
