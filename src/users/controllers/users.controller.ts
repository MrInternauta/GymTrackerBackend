import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GenericResponse } from 'src/core/interfaces/Responses/Generic';

import { Is_PublicD } from '../../core/auth/decorators/public.decorator';
import { RoleD } from '../../core/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { Role } from '../../core/auth/models/roles.model';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @RoleD(Role.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User list',
    description: `Get all users, method allowed for ${Role.ADMIN} rol`,
    parameters: [
      {
        name: 'page',
        description: 'Page number',
        in: 'query',
        required: false,
      },
      {
        name: 'limit',
        description: 'Limit of users per page',
        in: 'query',
        required: false,
      },
    ],
  })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<GenericResponse<User[]>> {
    const data = await this.usersService.findAll(page, limit);
    return {
      data,
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user by Id',
    description: `Get user, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'userId',
        description: 'user Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async get(@Param('userId', ParseIntPipe) id: number): Promise<GenericResponse<User>> {
    return {
      data: await this.usersService.findOne(id),
    };
  }

  @RoleD(Role.ADMIN)
  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an admin user',
    description: `Create an admin user, method allowed for ${Role.ADMIN} rol`,
  })
  async createUser(@Body() payload: CreateUserDto): Promise<GenericResponse<User>> {
    return {
      data: await this.usersService.create(payload),
    };
  }

  @Is_PublicD()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an client user',
    description: `Create an client user, method publc users create`,
  })
  async create(@Body() payload: CreateCustomerDto): Promise<GenericResponse<User>> {
    return {
      data: await this.usersService.createClient(payload),
    };
  }

  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @ApiOperation({
    summary: 'Update an user',
    description: `Update user, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'userId',
        description: 'user Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async update(
    @Param('userId', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto
  ): Promise<GenericResponse<User>> {
    const wasUpdated = await this.usersService.update(id, payload);
    if (!wasUpdated) {
      throw new BadRequestException('User not updated');
    }
    return {
      message: 'User updated',
      data: wasUpdated,
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Put('customer/:userId')
  @ApiOperation({
    summary: 'Update a customer',
    description: `Update user, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'userId',
        description: 'user Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async updateCustomer(
    @Param('userId', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto
  ): Promise<GenericResponse<User>> {
    const wasUpdated = await this.usersService.updateCustomer(id, payload);
    if (!wasUpdated) {
      throw new BadRequestException('Customer not updated');
    }
    return {
      message: 'Customer updated',
      data: wasUpdated,
    };
  }

  @Delete(':userId')
  @RoleD(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an user',
    description: `Remove user, method allowed for ${Role.ADMIN} rol`,
    parameters: [
      {
        name: 'userId',
        description: 'user Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async remove(@Param('userId', ParseIntPipe) id: number): Promise<GenericResponse<null>> {
    await this.usersService.delete(+id);
    return {
      message: `User ${id} deleted`,
    };
  }
}
