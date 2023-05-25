import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class IEquipmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of equipment' })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Description of equipment' })
  public description: string;

  @IsString()
  @ApiProperty({ description: 'Link of equipment' })
  public link?: string;

  @IsString()
  @ApiProperty({ description: 'image 1 of equipment' })
  image1?: string;

  @IsString()
  @ApiProperty({ description: 'image 2 of equipment' })
  image2?: string;

  @IsString()
  @ApiProperty({ description: 'image 3 of equipment' })
  image3?: string;
}

// @IsString()
// @ApiProperty({ description: 'Id of equipment' })
// public id: string;
