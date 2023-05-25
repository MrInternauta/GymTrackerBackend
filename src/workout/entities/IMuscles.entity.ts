import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BasicEntity } from '../../core/interfaces/basic.entity';
import { IExercise } from './IExercise.entity';

@Entity({
  name: 'muscles',
})
export class IMuscles extends BasicEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public name: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'text' })
  public link?: string;

  @Column({ type: 'varchar' })
  image1?: string;

  @Column({ type: 'varchar' })
  image2?: string;

  @Column({ type: 'varchar' })
  image3?: string;

  @ManyToMany(() => IExercise, exercises => exercises.musclesTarget, {
    nullable: true,
  })
  exercises: Array<IExercise>;
}
