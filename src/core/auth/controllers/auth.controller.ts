import { Controller, Post, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { Request } from 'express';

import { User } from '../../../users/entities/user.entity';
import { StatusCodes } from '../../constants/status.codes';
import { GenericResponse } from '../../interfaces/Responses/Generic';
import { LoginResponse } from '../../interfaces/Responses/Login';
import { LOCAL_STRATEGY } from '../constants/auth';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard(LOCAL_STRATEGY))
  @Post('')
  login(@Req() request: Request): GenericResponse<LoginResponse> {
    const user = request.user as User;
    return {
      statusCode: StatusCodes.OK,
      data: {
        access_token: this.authService.generateToken(user),
        user,
      },
    };
  }
}
