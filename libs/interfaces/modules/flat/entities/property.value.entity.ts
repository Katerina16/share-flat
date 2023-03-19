import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn} from 'typeorm';
import {FlatEntity} from "@sf/interfaces/modules/flat/entities/flat.entity";
import {PropertyEntity} from "@sf/interfaces/modules/flat/entities/property.entity";

@Entity('property_value')
export class PropertyValueEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean', {
    nullable: false,
  })
  value: boolean;

  @ManyToOne(() => PropertyEntity, (property) => property.propertyValues)
  @JoinColumn({
    name: 'property_id',
    referencedColumnName: 'id'
  })
  property: PropertyEntity;

  @ManyToOne(() => FlatEntity, (flat) => flat.propertyValues)
  @JoinColumn({
    name: 'flat_id',
    referencedColumnName: 'id'
  })
  flat: FlatEntity;
}
