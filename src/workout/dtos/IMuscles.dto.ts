import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class IMusclesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of Muscles' })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Description of Muscles' })
  public description: string;

  @IsString()
  @ApiProperty({ description: 'Link of Muscles' })
  public link?: string;

  @IsString()
  @ApiProperty({ description: 'image 1 of Muscles' })
  image1?: string;

  @IsString()
  @ApiProperty({ description: 'image 2 of Muscles' })
  image2?: string;

  @IsString()
  @ApiProperty({ description: 'image 3 of Muscles' })
  image3?: string;
}
