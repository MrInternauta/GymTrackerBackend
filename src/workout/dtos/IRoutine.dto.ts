import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

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
