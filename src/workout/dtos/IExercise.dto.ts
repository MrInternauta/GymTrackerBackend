import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class IExerciseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of exercise' })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Description of exercise' })
  public description: string;

  @IsString()
  @ApiProperty({ description: 'Link of exercise' })
  public link?: string;

  @IsString()
  @ApiProperty({ description: 'image 1 of exercise' })
  image1?: string;

  @IsString()
  @ApiProperty({ description: 'image 2 of exercise' })
  image2?: string;

  @IsString()
  @ApiProperty({ description: 'image 3 of exercise' })
  image3?: string;
}
