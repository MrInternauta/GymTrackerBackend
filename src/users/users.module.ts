import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkoutModule } from '../workout/workout.module';
import { UsersController } from './controllers/users.controller';
import { Customer } from './entities/customer.entity';
import { User } from './entities/user.entity';
import { CustomersService } from './services/customers.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [forwardRef(() => WorkoutModule), TypeOrmModule.forFeature([User, Customer])],
  exports: [UsersService, CustomersService],
  providers: [UsersService, CustomersService],
  controllers: [UsersController],
})
export class UsersModule {}
