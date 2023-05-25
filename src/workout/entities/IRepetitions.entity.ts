import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'repetitions',
})
export class IRepetitions {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'int' })
  weight: number;
  @Column({ type: 'int' })
  reps: number;
}
