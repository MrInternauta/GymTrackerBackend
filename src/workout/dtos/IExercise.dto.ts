import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IExerciseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of exercise' })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Description of exercise' })
  public description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'equipment used for the exercise' })
  public equipmentId: number;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'muscles target used for the exercise' })
  public musclesTarget: Array<number>;

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
