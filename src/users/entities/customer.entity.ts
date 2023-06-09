import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BasicEntity } from '../../core/interfaces/basic.entity';
import { User } from './user.entity';

@Entity()
export class Customer extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @OneToOne(() => User, user => user.customer, { nullable: true }) //Bidirectional relation (ref)
  user: User;
}
