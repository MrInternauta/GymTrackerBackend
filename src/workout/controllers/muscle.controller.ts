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
import { IMuscleDto } from '../dtos/IMuscle.dto';
import { IMuscle } from '../entities/IMuscle.entity';
import { MuscleService } from '../services/muscle.service';

@Controller('muscle')
@ApiTags('muscle')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MuscleController {
  constructor(private MuscleService: MuscleService) {}

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Muscle list',
    description: `Get all Muscle, method allowed for ${Role.ADMIN} rol`,
    parameters: [
      {
        name: 'page',
        description: 'Page number',
        in: 'query',
        required: false,
      },
      {
        name: 'limit',
        description: 'Limit of Muscle per page',
        in: 'query',
        required: false,
      },
    ],
  })
  async findAll(@Query() params: FilterDto): Promise<GenericResponse<IMuscle[]>> {
    const data = await this.MuscleService.findAll(params.offset, params.limit);
    return {
      data,
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get(':MuscleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Muscle by Id',
    description: `Get Muscle, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'MuscleId',
        description: 'Muscle Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async get(@Param('MuscleId', ParseIntPipe) id: number): Promise<GenericResponse<IMuscle>> {
    return {
      data: await this.MuscleService.findOne(id),
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an Muscle',
    description: `Create an Muscle, method allowed for ${Role.ADMIN} rol`,
  })
  async createMuscle(@Body() payload: IMuscleDto): Promise<GenericResponse<IMuscle>> {
    return {
      data: await this.MuscleService.create(payload),
    };
  }

  @Put(':MuscleId')
  @HttpCode(HttpStatus.OK)
  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @ApiOperation({
    summary: 'Update an Muscle',
    description: `Update Muscle, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'MuscleId',
        description: 'Muscle Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async update(
    @Param('MuscleId', ParseIntPipe) id: number,
    @Body() payload: IMuscleDto
  ): Promise<GenericResponse<IMuscle>> {
    const wasUpdated = await this.MuscleService.update(id, payload);
    if (!wasUpdated) {
      throw new BadRequestException('Muscle not updated');
    }
    return {
      message: 'Muscle updated',
      data: wasUpdated,
    };
  }

  @Delete(':MuscleId')
  @RoleD(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an Muscle',
    description: `Remove Muscle, method allowed for ${Role.ADMIN} rol`,
    parameters: [
      {
        name: 'MuscleId',
        description: 'Muscle Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async remove(@Param('MuscleId', ParseIntPipe) id: number): Promise<GenericResponse<null>> {
    await this.MuscleService.delete(+id);
    return {
      message: `Muscle ${id} deleted`,
    };
  }
}
