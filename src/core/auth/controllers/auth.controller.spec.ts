import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../../../users/entities/user.entity';
import { Role } from '../models/roles.model';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login', () => {
    it('Right', async () => {
      const result = 'my_generated_token';
      jest.spyOn(authService, 'generateToken').mockImplementation(() => result);
      const data: User = {
        id: 1,
        email: 'email@email.com',
        role: Role.ADMIN,
      } as User;
      expect(authService.generateToken(data)).toBe(result);
    });
  });
});
