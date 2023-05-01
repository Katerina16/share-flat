import { Entity, Column, PrimaryGeneratedColumn, Index, BaseEntity, OneToMany } from 'typeorm';
import { FlatEntity } from "@sf/interfaces/modules/flat/entities/flat.entity";

@Entity('city')
export class CityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('cityNameIndex', { unique: true })
  @Column()
  name: string;

  @OneToMany(() => FlatEntity, (flats) => flats.city)
  flats: FlatEntity[];
}
