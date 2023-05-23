import { Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { HttpCode, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';

import { User } from '../../../users/entities/user.entity';
import { GenericResponse } from '../../interfaces/Responses/Generic';
import { LoginResponse } from '../../interfaces/Responses/Login';
import { LOCAL_STRATEGY } from '../constants/auth';
import { Role } from '../models/roles.model';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard(LOCAL_STRATEGY))
  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Allowes login',
    description: `Login users, method allowed for ${Role.ADMIN}, and ${Role.CUSTOMER} roles`,
    parameters: [
      {
        name: 'email',
        in: 'query',
        required: true,
      },
      {
        name: 'password',
        in: 'query',
        required: true,
      },
    ],
  })
  login(@Req() request: Request): GenericResponse<LoginResponse> {
    const user = request.user as User;
    return {
      data: {
        access_token: this.authService.generateToken(user),
        user,
      },
    };
  }
}
