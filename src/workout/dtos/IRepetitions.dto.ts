import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, Min } from 'class-validator';

export class IRepetitionsDto {
  @IsNumber()
  @Min(1)
  @ApiProperty({ description: 'weight' })
  weight: number;

  @IsNumber()
  @Min(1)
  @ApiProperty({ description: 'reps' })
  reps: number;
}
