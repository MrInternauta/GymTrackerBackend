import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BasicEntity } from '../../core/interfaces/basic.entity';
import { IExercise } from './IExercise.entity';

@Entity({
  name: 'equipments',
})
export class IEquipment extends BasicEntity {
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

  @OneToMany(() => IExercise, exercise => exercise.equipment)
  exercises: Array<IExercise>;
}
