import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BasicEntity } from '../../core/interfaces/basic.entity';
import { User } from '../../users/entities/user.entity';
import { IRepetitionsRoutines } from './IRepetitionsRoutines.entity';

@Entity({
  name: 'routines',
})
export class IRoutine extends BasicEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  public name: string;

  @Column({
    type: 'text',
  })
  public description: string;

  @OneToMany(() => IRepetitionsRoutines, workout => workout.routine, {
    nullable: true,
  })
  public repetitions: Array<IRepetitionsRoutines>;

  @ManyToMany(() => User, user => user.routines, {
    nullable: true,
  })
  @JoinTable({
    name: 'routines_user',
    joinColumn: {
      name: 'routine_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  public users: Array<User>;
}
