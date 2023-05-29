import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { IRepetitionsRoutinesDto } from './IRepetitionsRoutines.dto';

export class IRoutineDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of Routine' })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Description of Routine' })
  public description: string;
}
export class UpdateIRoutineDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'repetitions used for the Routine' })
  public repetitionsRoutine: Array<IRepetitionsRoutinesDto>;
}
