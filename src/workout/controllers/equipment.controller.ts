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

import { RoleD } from '../../core/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { Role } from '../../core/auth/models/roles.model';
import { FilterDto } from '../../core/interfaces/filter.dto';
import { IEquipmentDto } from '../dtos/IEquipment.dto';
import { IEquipment } from '../entities/IEquipment.entity';
import { EquipmentService } from '../services/equipment.service';

@Controller('equipment')
@ApiTags('equipment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EquipmentController {
  constructor(private equipmentService: EquipmentService) {}

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Equipment list',
    description: `Get all Equipment, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'page',
        description: 'Page number',
        in: 'query',
        required: false,
      },
      {
        name: 'limit',
        description: 'Limit of Equipment per page',
        in: 'query',
        required: false,
      },
    ],
  })
  async findAll(@Query() params: FilterDto): Promise<GenericResponse<IEquipment[]>> {
    const data = await this.equipmentService.findAll(params.offset, params.limit);
    return {
      data,
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get(':EquipmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Equipment by Id',
    description: `Get Equipment, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'EquipmentId',
        description: 'Equipment Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async get(@Param('EquipmentId', ParseIntPipe) id: number): Promise<GenericResponse<IEquipment>> {
    return {
      data: await this.equipmentService.findOne(id),
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an Equipment',
    description: `Create an Equipment, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
  })
  async createEquipment(@Body() payload: IEquipmentDto): Promise<GenericResponse<IEquipment>> {
    return {
      data: await this.equipmentService.create(payload),
    };
  }

  @Put(':EquipmentId')
  @HttpCode(HttpStatus.OK)
  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @ApiOperation({
    summary: 'Update an Equipment',
    description: `Update Equipment, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'EquipmentId',
        description: 'Equipment Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async update(
    @Param('EquipmentId', ParseIntPipe) id: number,
    @Body() payload: IEquipmentDto
  ): Promise<GenericResponse<IEquipment>> {
    const wasUpdated = await this.equipmentService.update(id, payload);
    if (!wasUpdated) {
      throw new BadRequestException('Equipment not updated');
    }
    return {
      message: 'Equipment updated',
      data: wasUpdated,
    };
  }

  @Delete(':EquipmentId')
  @RoleD(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an Equipment',
    description: `Remove Equipment, method allowed for ${Role.ADMIN} rol`,
    parameters: [
      {
        name: 'EquipmentId',
        description: 'Equipment Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async remove(@Param('EquipmentId', ParseIntPipe) id: number): Promise<GenericResponse<null>> {
    await this.equipmentService.delete(+id);
    return {
      message: `Equipment ${id} deleted`,
    };
  }
}
