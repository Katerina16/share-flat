import {Entity, Column, PrimaryGeneratedColumn, Index, BaseEntity} from 'typeorm';

@Entity('city')
export class CityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('cityNameIndex', { unique: true })
  @Column()
  name: string;
}
