import {Injectable} from '@nestjs/common';
import {CreateFlatDto} from "@sf/interfaces/modules/flat/dto/create.flat.dto";
import {FlatEntity} from "@sf/interfaces/modules/flat/entities/flat.entity";
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";


@Injectable()
export class FlatService {

  async create(userId: number, flat: CreateFlatDto): Promise<FlatEntity> {

    flat.user = await UserEntity.findOne({ where: { id: userId } });

    return FlatEntity.create<FlatEntity>(flat).save();

  }
}
