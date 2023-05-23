import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersModule } from 'src/orders/orders.module';

import { OrdersController } from '../orders/controllers/orders.controller';
import { ProductsModule } from '../products/products.module';
import { ProfileController } from './controllers/profile.controller';
import { UsersController } from './controllers/users.controller';
import { Customer } from './entities/customer.entity';
import { User } from './entities/user.entity';
import { CustomersService } from './services/customers.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [forwardRef(() => OrdersModule), ProductsModule, TypeOrmModule.forFeature([User, Customer])],
  exports: [UsersService, CustomersService],
  providers: [UsersService, CustomersService],
  controllers: [UsersController, OrdersController, ProfileController],
})
export class UsersModule {}
