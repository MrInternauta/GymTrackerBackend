import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class IRepetitionsRoutinesDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'exercise used for the routine' })
  public exerciseId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'serie of exercise used for the routine' })
  public serieExercise: number;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'repetitions used for the exercise' })
  public repetitionsWeight: Array<Array<number>>;
}
