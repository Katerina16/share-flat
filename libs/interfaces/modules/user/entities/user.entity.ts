import {Entity, Column, PrimaryGeneratedColumn, Index, BaseEntity} from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  middleName: string;

  @Index('userEmailIndex', { unique: true })
  @Column('text', {
    nullable: false
  })
  email: string;

  @Column('character varying', {
    nullable: false,
  })
  password: string;

  @Column('character varying', {
    nullable: false,
  })
  phone: string;

  @Column('timestamp without time zone', {
    default: () => '(now() at time zone \'Europe/Moscow\')'
  })
  created: Date;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ default: false })
  isAdmin?: boolean;

}
