import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFlatDto } from '@sf/interfaces/modules/flat/dto/create.flat.dto';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { PropertyValueEntity } from '@sf/interfaces/modules/flat/entities/property.value.entity';
import { UserEntity } from '@sf/interfaces/modules/user/entities/user.entity';
import crypto from 'crypto';
import fs from 'fs';
import { PropertyEntity } from '@sf/interfaces/modules/flat/entities/property.entity';
import * as dateFns from 'date-fns';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export class FlatService {
  async find({
               limit,
               offset,
               shared,
               cityId,
               from,
               to,
               guests,
               squareFrom,
               squareTo,
               priceFrom,
               priceTo,
               rooms,
               properties,
             }): Promise<{ count: number; flats: FlatEntity[] }> {
    const flats = await FlatEntity.find({
      relations: [
        'city',
        'propertyValues',
        'propertyValues.property',
        'user',
        'reservations',
        'sharedReservations',
        'reviews',
      ],
      where: {
        city: { id: cityId },
        guests: MoreThanOrEqual(guests),
        shared,
        deleted: false,
      },
    });

    const filteredFlats = flats.filter((flat) => {
      for (const reservation of flat.reservations.filter(({confirmed}) => confirmed)) {
        if (
          !(
            dateFns.isBefore(new Date(to), new Date(reservation.from)) ||
            dateFns.isAfter(new Date(from), new Date(reservation.to))
          )
        ) {
          return false;
        }
      }

      if (shared) {
        for (const reservation of flat.sharedReservations) {
          if (
            !(
              dateFns.isBefore(new Date(to), new Date(reservation.from)) ||
              dateFns.isAfter(new Date(from), new Date(reservation.to))
            )
          ) {
            return false;
          }
        }
      }

      if (squareFrom && squareTo) {
        return !(flat.square >= squareFrom && flat.square <= squareTo);
      }

      if (squareFrom) {
        return flat.square >= squareFrom;
      }

      if (squareTo) {
        return flat.square <= squareTo;
      }

      if (priceFrom && priceTo) {
        return !(flat.price >= priceFrom && flat.price <= priceTo);
      }

      if (priceFrom) {
        return flat.price >= priceFrom;
      }

      if (priceTo) {
        return flat.price <= priceTo;
      }

      if (rooms) {
        return flat.rooms !== rooms;
      }

      if (properties) {
        if (
          !properties.every((property) =>
            flat.propertyValues
              .filter((v) => v.value)
              .map((propertyValue) => propertyValue.property.id)
              .includes(property)
          )
        ) {
          return false;
        }
      }

      flat.reviewsCount = flat.reviews.length;

      flat.reviewsRating =
        flat.reviewsCount > 0 ? flat.reviews.reduce((acc, curr) => acc + curr.rating, 0) / flat.reviewsCount : 0;

      flat.reviewsRating = Math.round(flat.reviewsRating * 100) / 100;

      delete flat.reservations;
      delete flat.sharedReservations;
      delete flat.reviews;
      delete flat.propertyValues;

      return true;
    });

    return {
      count: filteredFlats.length,
      flats: filteredFlats.slice(offset, limit + offset),
    };
  }

  async findMy(userId, { from, to }): Promise<FlatEntity[]> {
    const flats = await FlatEntity.find({
      relations: ['city', 'propertyValues', 'propertyValues.property', 'reservations', 'reviews'],
      where: {
        user: { id: userId },
        deleted: false,
      },
    });

    for (const flat of flats) {
      flat.reviewsCount = flat.reviews.length;

      flat.reviewsRating =
        flat.reviewsCount > 0 ? flat.reviews.reduce((acc, curr) => acc + curr.rating, 0) / flat.reviewsCount : 0;

      flat.reviewsRating = Math.round(flat.reviewsRating * 100) / 100;
    }

    if (from && to) {
      return flats.filter((flat) => {
        for (const reservation of flat.reservations) {
          if (
            !(
              dateFns.isBefore(new Date(to), new Date(reservation.from)) ||
              dateFns.isAfter(new Date(from), new Date(reservation.to))
            )
          ) {
            return false;
          }
        }

        return true;
      });
    }

    return flats;
  }

  async findById(id): Promise<FlatEntity> {
    return FlatEntity.findOne({
      where: { id },
      relations: ['propertyValues', 'propertyValues.property', 'user', 'city', 'freeDates', 'reservations'],
    });
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

  async update(userId: number, flatId: number, flatData: CreateFlatDto): Promise<FlatEntity> {
    const flat = await this.findById(flatId);

    if (userId !== flat.user.id) {
      throw new ForbiddenException();
    }

    const { propertyValues } = flatData;
    delete flatData.propertyValues;
    delete flatData.reservations;

    await FlatEntity.update<FlatEntity>({ id: flatId }, flatData);

    for (const propertyValue of flat.propertyValues) {
      await PropertyValueEntity.delete(propertyValue.id);
    }

    for (const propertyValue of propertyValues) {
      propertyValue.flat = { id: flat.id } as FlatEntity;
    }

    await PropertyValueEntity.insert(propertyValues);

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

    await FlatEntity.update({ id: flatId }, { photos });
    await fs.writeFileSync(`photos/flat/${flatId}/${fileName}`, file.buffer);
  }

  async deletePhoto(userId: number, flatId: number, fileName: string) {
    const flat = await this.findById(flatId);

    flat.photos = flat.photos.filter((photo) => photo !== fileName);

    await this.update(userId, flatId, flat);

    await fs.unlinkSync(`photos/flat/${flatId}/${fileName}`);
  }

  async findProperties(): Promise<PropertyEntity[]> {
    return PropertyEntity.find();
  }

  async delete(userId: number, flatId: number): Promise<void> {
    await FlatEntity.update<FlatEntity>({ id: flatId, user: { id: userId } }, { deleted: true });
  }
}
