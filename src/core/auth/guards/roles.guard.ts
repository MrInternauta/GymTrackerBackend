import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '../../../core/constants/constants';
import { User } from '../../../users/entities/user.entity';
import { Role } from '../models/roles.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflectorService: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles_allowed: Role[] = this.reflectorService.get<Role[]>(ROLES_KEY, context.getHandler());

    //Allow because doesnt have a role config
    if (!roles_allowed) {
      return true;
    }
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user as User;
    const haveRol = roles_allowed.some(rol => rol === user.role);
    if (!haveRol) {
      throw new UnauthorizedException(`The ${user?.role} role doesn't have permission`);
    }

    return haveRol;
  }
}
