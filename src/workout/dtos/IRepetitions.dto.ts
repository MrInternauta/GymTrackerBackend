import { ApiProperty } from '@nestjs/swagger';

import { IsNumber } from 'class-validator';

export class IRepetitionsDto {
  @IsNumber()
  @ApiProperty({ description: 'weight' })
  weight: number;

  @IsNumber()
  @ApiProperty({ description: 'reps' })
  reps: number;
}
