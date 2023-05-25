import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BasicEntity } from '../../core/interfaces/basic.entity';
import { IEquipment } from './IEquipment.entity';
import { IMuscles } from './IMuscles.entity';

@Entity({
  name: 'exercises',
})
export class IExercise extends BasicEntity {
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

  @ManyToMany(() => IMuscles, musclesTarget => musclesTarget.exercises, {
    nullable: true,
  })
  @JoinTable({
    name: 'exercise_muscle',
    joinColumn: {
      name: 'muscle_id',
    },
    inverseJoinColumn: {
      name: 'exercise_id',
    },
  })
  public musclesTarget: Array<IMuscles>;

  @ManyToOne(() => IEquipment, equipment => equipment.exercises, { nullable: true })
  @JoinColumn({
    name: 'equipment_id',
  })
  public equipment: IEquipment;

  @Column({ type: 'text' })
  public link?: string;

  @Column({ type: 'varchar' })
  public image1?: string;

  @Column({ type: 'varchar' })
  public image2?: string;

  @Column({ type: 'varchar' })
  public image3?: string;
}
