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
import { IRepetitionsRoutinesDto } from '../dtos/IRepetitionsRoutines.dto';
import { IRoutineDto } from '../dtos/IRoutine.dto';
import { IRoutine } from '../entities/IRoutine.entity';
import { RoutineService } from '../services/routine.service';

@Controller('routine')
@ApiTags('routine')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoutineController {
  constructor(private RoutineService: RoutineService) {}

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Routine list',
    description: `Get all Routine, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'page',
        description: 'Page number',
        in: 'query',
        required: false,
      },
      {
        name: 'limit',
        description: 'Limit of Routine per page',
        in: 'query',
        required: false,
      },
    ],
  })
  async findAll(@Query() params: FilterDto): Promise<GenericResponse<IRoutine[]>> {
    const data = await this.RoutineService.findAll(params.offset, params.limit);
    return {
      data,
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get(':RoutineId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Routine by Id',
    description: `Get Routine, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'RoutineId',
        description: 'Routine Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async get(@Param('RoutineId', ParseIntPipe) id: number): Promise<GenericResponse<IRoutine>> {
    return {
      data: await this.RoutineService.findOne(id),
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an Routine',
    description: `Create an Routine, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
  })
  async createRoutine(@Body() payload: IRoutineDto): Promise<GenericResponse<IRoutine>> {
    return {
      data: await this.RoutineService.create(payload),
    };
  }

  @Put(':RoutineId')
  @HttpCode(HttpStatus.OK)
  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @ApiOperation({
    summary: 'Update an Routine',
    description: `Update Routine, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'RoutineId',
        description: 'Routine Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async update(
    @Param('RoutineId', ParseIntPipe) id: number,
    @Body() payload: IRoutineDto
  ): Promise<GenericResponse<IRoutine>> {
    const wasUpdated = await this.RoutineService.update(id, payload);
    if (!wasUpdated) {
      throw new BadRequestException('Routine not updated');
    }
    return {
      message: 'Routine updated',
      data: wasUpdated,
    };
  }

  @Put('add/:RoutineId')
  @HttpCode(HttpStatus.OK)
  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @ApiOperation({
    summary: 'Update an Routine and add reps',
    description: `Update Routine, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'RoutineId',
        description: 'Routine Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async addReps(
    @Param('RoutineId', ParseIntPipe) id: number,
    @Body() payload: IRepetitionsRoutinesDto
  ): Promise<GenericResponse<IRoutine>> {
    const wasUpdated = await this.RoutineService.addReps(id, payload);
    if (!wasUpdated) {
      throw new BadRequestException('Routine not updated');
    }
    return {
      message: 'Routine updated',
      data: wasUpdated,
    };
  }

  @Delete(':RoutineId')
  @RoleD(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an Routine',
    description: `Remove Routine, method allowed for ${Role.ADMIN} rol`,
    parameters: [
      {
        name: 'RoutineId',
        description: 'Routine Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async remove(@Param('RoutineId', ParseIntPipe) id: number): Promise<GenericResponse<null>> {
    await this.RoutineService.delete(+id);
    return {
      message: `Routine ${id} deleted`,
    };
  }
}
