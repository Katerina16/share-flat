import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFlatDto } from "@sf/interfaces/modules/flat/dto/create.flat.dto";
import { FlatEntity } from "@sf/interfaces/modules/flat/entities/flat.entity";
import { PropertyValueEntity } from "@sf/interfaces/modules/flat/entities/property.value.entity";
import { UserEntity } from "@sf/interfaces/modules/user/entities/user.entity";
import crypto from "crypto";
import fs from "fs";
import { PropertyEntity } from "@sf/interfaces/modules/flat/entities/property.entity";
import * as dateFns from 'date-fns'
import { MoreThanOrEqual } from "typeorm";
import { FreeDateEntity } from "@sf/interfaces/modules/flat/entities/free.date.entity";
import { ReviewEntity } from "@sf/interfaces/modules/flat/entities/review.entity";


@Injectable()
export class FlatService {

  async find({ shared, cityId, from, to, guests }): Promise<FlatEntity[]> {
    const flats= await FlatEntity.find({
      relations: ['city', 'propertyValues', 'propertyValues.property', 'user', 'freeDates', 'reservations', 'sharedReservations', 'reviews'],
      where: {
        city: { id: cityId },
        guests: MoreThanOrEqual(guests),
        shared,
      }
    });

    return flats.filter(flat => {
      for (const reservation of flat.reservations) {
        if (
          !(dateFns.isBefore(new Date(to), new Date(reservation.from))
          || dateFns.isAfter(new Date(from), new Date(reservation.to))
        )) {
          return false;
        }
      }

      if (shared) {
        for (const reservation of flat.sharedReservations) {
          if (
            !(dateFns.isBefore(new Date(to), new Date(reservation.from))
              || dateFns.isAfter(new Date(from), new Date(reservation.to))
            )) {
            return false;
          }
        }
      }

      flat.reviewsCount = flat.reviews.length;

      flat.reviewsRating = flat.reviewsCount > 0
        ? (flat.reviews.reduce((acc, curr) => acc + curr.rating, 0)) / flat.reviewsCount
        : 0;

      flat.reviewsRating = Math.round(flat.reviewsRating * 100) / 100;

      delete flat.reservations;
      delete flat.sharedReservations;
      delete flat.reviews;

      return true;

    });
  }

  async findById(id): Promise<FlatEntity> {
    return FlatEntity.findOne({
      where: { id },
      relations: ['propertyValues', 'propertyValues.property', 'user', 'city', 'freeDates']
    });
  }

  async findReviews(id): Promise<ReviewEntity[]> {
    return ReviewEntity.find({
      where: { flat: { id } } ,
    });
  }

  async create(userId: number, flatData: CreateFlatDto): Promise<FlatEntity> {

    flatData.user = await UserEntity.findOne({ where: { id: userId } });

    const flat = await FlatEntity.create<FlatEntity>(flatData as FlatEntity).save();

    for (const propertyValue of flat.propertyValues) {
      propertyValue.flat = { id: flat.id } as FlatEntity;
    }

    await PropertyValueEntity.insert(flat.propertyValues);

    for (const freeDate of flat.freeDates) {
      freeDate.flat = { id: flat.id } as FlatEntity;
    }

    await FreeDateEntity.insert(flat.freeDates);

    return flat;

  }

  async update(userId: number, flatId: number, flatData: CreateFlatDto): Promise<FlatEntity> {

    const flat = await this.findById(flatId);

    if (userId !== flat.user.id) {
      throw new ForbiddenException();
    }

    const { propertyValues, freeDates } = flatData;
    delete flatData.propertyValues;
    delete flatData.freeDates;

    await FlatEntity.update<FlatEntity>({ id: flatId }, flatData);

    for (const propertyValue of flat.propertyValues) {
      await PropertyValueEntity.delete(propertyValue.id);
    }

    for (const propertyValue of propertyValues) {
      propertyValue.flat = { id: flat.id } as FlatEntity;
    }

    await PropertyValueEntity.insert(propertyValues);

    for (const freeDate of flat.freeDates) {
      await FreeDateEntity.delete(freeDate.id);
    }

    for (const freeDate of freeDates) {
      freeDate.flat = { id: flat.id } as FlatEntity;
    }

    await FreeDateEntity.insert(freeDates);

    return flat;
  }

  async addPhoto(flatId: number, file) {
    if (!fs.existsSync(`photos/flat/${flatId}`)) {
      fs.mkdirSync(`photos/flat/${flatId}`, { recursive: true });
    }

    const fileName = `${crypto.randomUUID()}.png`;

    const flat = await FlatEntity.findOne({ where: { id: flatId } });
    flat.photos.push(fileName);
    const photos = flat.photos;

    await FlatEntity.update({ id: flatId }, { photos })
    await fs.writeFileSync(`photos/flat/${flatId}/${fileName}`, file.buffer)

  }


  async deletePhoto(userId: number, flatId: number, fileName: string) {

    const flat = await this.findById(flatId);

    flat.photos = flat.photos.filter(photo => photo !== fileName);

    await this.update(userId, flatId, flat);

    await fs.unlinkSync(`photos/flat/${flatId}/${fileName}`)

  }

  async findProperties(): Promise<PropertyEntity[]> {
    return PropertyEntity.find();
  }
}
