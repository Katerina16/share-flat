import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn} from 'typeorm';
import {FlatEntity} from "@sf/interfaces/modules/flat/entities/flat.entity";

@Entity('free_date')
export class FreeDateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp without time zone', {
    default: () => '(now() at time zone \'Europe/Moscow\')'
  })
  created: Date;

  @Column('timestamp without time zone')
  from: Date;

  @Column('timestamp without time zone')
  to: Date;

  @ManyToOne(() => FlatEntity, (flat) => flat.freeDates)
  @JoinColumn({
    name: 'flat_id',
    referencedColumnName: 'id'
  })
  flat: FlatEntity;

}
