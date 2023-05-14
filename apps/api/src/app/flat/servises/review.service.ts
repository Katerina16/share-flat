import { Injectable } from '@nestjs/common';
import { UserEntity } from '@sf/interfaces/modules/user/entities/user.entity';
import { ReviewEntity } from '@sf/interfaces/modules/flat/entities/review.entity';
import { CreateReviewDto } from '@sf/interfaces/modules/flat/dto/create.review.dto';

@Injectable()
export class ReviewService {
  constructor() {}

  async find(flatId: number): Promise<ReviewEntity[]> {
    return ReviewEntity.find({
      where: { flat: { id: flatId } },
      relations: ['user'],
    });
  }

  async create(userId: number, review: CreateReviewDto): Promise<void> {
    review.user = { id: userId } as UserEntity;

    await ReviewEntity.insert(review);
  }
}
