import {Entity, Column, PrimaryGeneratedColumn, BaseEntity,  OneToMany} from 'typeorm';
import {PropertyValueEntity} from "@sf/interfaces/modules/flat/entities/property.value.entity";

@Entity('property')
export class PropertyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying', {
    nullable: false,
  })
  name: string;

  @OneToMany(() => PropertyValueEntity, (propertyValue) => propertyValue.property)
  propertyValues: PropertyValueEntity[];
}
