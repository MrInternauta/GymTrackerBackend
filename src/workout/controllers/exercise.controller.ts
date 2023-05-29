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
import { IExerciseDto } from '../dtos/IExercise.dto';
import { IExercise } from '../entities/IExercise.entity';
import { ExerciseService } from '../services/exercise.service';

@Controller('exercise')
@ApiTags('exercise')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExerciseController {
  constructor(private ExerciseService: ExerciseService) {}

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Exercise list',
    description: `Get all Exercise, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'page',
        description: 'Page number',
        in: 'query',
        required: false,
      },
      {
        name: 'limit',
        description: 'Limit of Exercise per page',
        in: 'query',
        required: false,
      },
    ],
  })
  async findAll(@Query() params: FilterDto): Promise<GenericResponse<IExercise[]>> {
    const data = await this.ExerciseService.findAll(params.offset, params.limit);
    return {
      data,
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get(':ExerciseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Exercise by Id',
    description: `Get Exercise, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'ExerciseId',
        description: 'Exercise Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async get(@Param('ExerciseId', ParseIntPipe) id: number): Promise<GenericResponse<IExercise>> {
    const getRelations = true;
    return {
      data: await this.ExerciseService.findOne(id, getRelations),
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an Exercise',
    description: `Create an Exercise, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
  })
  async createExercise(@Body() payload: IExerciseDto): Promise<GenericResponse<IExercise>> {
    return {
      data: await this.ExerciseService.create(payload),
    };
  }

  @Put(':ExerciseId')
  @HttpCode(HttpStatus.OK)
  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @ApiOperation({
    summary: 'Update an Exercise',
    description: `Update Exercise, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'ExerciseId',
        description: 'Exercise Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async update(
    @Param('ExerciseId', ParseIntPipe) id: number,
    @Body() payload: IExerciseDto
  ): Promise<GenericResponse<IExercise>> {
    const wasUpdated = await this.ExerciseService.update(id, payload);
    if (!wasUpdated) {
      throw new BadRequestException('Exercise not updated');
    }
    return {
      message: 'Exercise updated',
      data: wasUpdated,
    };
  }

  @Delete(':ExerciseId')
  @RoleD(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an Exercise',
    description: `Remove Exercise, method allowed for ${Role.ADMIN} rol`,
    parameters: [
      {
        name: 'ExerciseId',
        description: 'Exercise Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async remove(@Param('ExerciseId', ParseIntPipe) id: number): Promise<GenericResponse<null>> {
    await this.ExerciseService.delete(+id);
    return {
      message: `Exercise ${id} deleted`,
    };
  }
}
