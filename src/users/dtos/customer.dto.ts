import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

import { CreateUserDto } from './user.dto';

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name for the customer' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Last name for the customer' })
  readonly lastName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  @ApiProperty({ description: 'phone number' })
  readonly phone: string;
}

export class CreateCustomerDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name for the customer' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Last name for the customer' })
  readonly lastName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  @ApiProperty({ description: 'phone number' })
  readonly phone: string;
}
export class UpdateCustomerDto extends PartialType(CustomerDto) {}
