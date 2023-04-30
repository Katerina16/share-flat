import {Injectable} from '@nestjs/common';
import {CreateFlatDto} from "@sf/interfaces/modules/flat/dto/create.flat.dto";
import {FlatEntity} from "@sf/interfaces/modules/flat/entities/flat.entity";
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import {PropertyValueEntity} from "@sf/interfaces/modules/flat/entities/property.value.entity";


@Injectable()
export class FlatService {

  async findById(id): Promise<FlatEntity> {
    return FlatEntity.findOne({ where: { id }, relations: ['propertyValues', 'propertyValues.property', 'user'] });
  }

  async create(userId: number, flatData: CreateFlatDto): Promise<FlatEntity> {

    flatData.user = await UserEntity.findOne({ where: { id: userId } });

    const flat = await FlatEntity.create<FlatEntity>(flatData as FlatEntity).save();

    for (const propertyValue of flat.propertyValues) {
      propertyValue.flat = { id: flat.id } as FlatEntity;
    }

    await PropertyValueEntity.insert(flat.propertyValues);

    return flat;

  }
}
