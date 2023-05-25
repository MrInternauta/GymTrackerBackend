import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { IExercise } from './IExercise.entity';
import { IRepetitions } from './IRepetitions.entity';
import { IRoutine } from './IRoutine.entity';

@Entity({
  name: 'repetitions_routines',
})
export class IRepetitionsRoutines {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => IExercise, {
    nullable: true,
  })
  @JoinColumn({
    name: 'exercise_id',
  })
  exercise: IExercise;

  @ManyToOne(() => IRoutine, routine => routine.repetitions, { nullable: true })
  @JoinColumn({
    name: 'routine_id',
  }) //naming  n to 1
  routine: IRoutine;

  @OneToMany(() => IRepetitions, reps => reps, {
    nullable: true,
  })
  repetitions: Array<IRepetitions>;
}
