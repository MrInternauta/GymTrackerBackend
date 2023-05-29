import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from '../../../users/entities/user.entity';
import { UsersService } from '../../../users/services/users.service';
import { AuthSuccess } from '../../interfaces/Responses/Login';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async validateUser(userName: string, password: string) {
    const user = await this.userService.findByEmail(userName);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('The email address or password is wrong!');
    }
    return user;
  }

  validateToken(token: string) {
    return this.jwtService.verify(token);
  }

  generateToken(user: User): AuthSuccess {
    return {
      access_token: this.jwtService.sign({ ...user, password: null }),
      user,
    };
  }
}
