import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn} from 'typeorm';
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";
import {FlatEntity} from "@sf/interfaces/modules/flat/entities/flat.entity";

@Entity('review')
export class ReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp without time zone', {
    default: () => '(now() at time zone \'Europe/Moscow\')'
  })
  created: Date;

  @Column('int', {
    nullable: false,
  })
  rating: number;

  @Column('text', {
    nullable: true,
  })
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id'
  })
  user: UserEntity;


  @ManyToOne(() => FlatEntity, (flat) => flat.reviews)
  @JoinColumn({
    name: 'flat_id',
    referencedColumnName: 'id'
  })
  flat: FlatEntity;

}
