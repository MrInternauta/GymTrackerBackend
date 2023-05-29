import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GenericResponse } from 'src/core/interfaces/Responses/Generic';

import { RoleD } from '../../core/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { Role } from '../../core/auth/models/roles.model';
import { FilterDto } from '../../core/interfaces/filter.dto';
import { IRepetitions } from '../entities/IRepetitions.entity';
import { RepetitionsService } from '../services/repetitions.service';

@Controller('repetitions')
@ApiTags('repetitions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RepetitionsController {
  constructor(private RepetitionsService: RepetitionsService) {}

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Repetitions list',
    description: `Get all Repetitions, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'page',
        description: 'Page number',
        in: 'query',
        required: false,
      },
      {
        name: 'limit',
        description: 'Limit of Repetitions per page',
        in: 'query',
        required: false,
      },
    ],
  })
  async findAll(@Query() params: FilterDto): Promise<GenericResponse<IRepetitions[]>> {
    const data = await this.RepetitionsService.findAll(params.offset, params.limit);
    return {
      data,
    };
  }

  @RoleD(Role.ADMIN, Role.CUSTOMER)
  @Get(':RepetitionsId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Repetitions by Id',
    description: `Get Repetitions, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'RepetitionsId',
        description: 'Repetitions Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async get(@Param('RepetitionsId', ParseIntPipe) id: number): Promise<GenericResponse<IRepetitions>> {
    return {
      data: await this.RepetitionsService.findOne(id),
    };
  }

  @Delete(':RepetitionsId')
  @RoleD(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an Repetitions',
    description: `Remove Repetitions, method allowed for ${Role.ADMIN} rol`,
    parameters: [
      {
        name: 'RepetitionsId',
        description: 'Repetitions Id',
        in: 'path',
        required: true,
      },
    ],
  })
  async remove(@Param('RepetitionsId', ParseIntPipe) id: number): Promise<GenericResponse<null>> {
    await this.RepetitionsService.delete(+id);
    return {
      message: `Repetitions ${id} deleted`,
    };
  }
}
