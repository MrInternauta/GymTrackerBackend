import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Role } from '../../core/auth/models/roles.model';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
// import { Client } from 'pg';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
// import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { CustomersService } from './customers.service';

@Injectable()
export class UsersService {
  constructor(private customerService: CustomersService, @InjectRepository(User) private userRepo: Repository<User>) {}

  findAll(page: number, limit: number) {
    const end = page * limit;
    const start = end - limit;
    return this.userRepo.find({
      relations: ['customer'],
    });
  }

  findbyCustomerId(id: number) {
    return this.userRepo.find({
      where: { customer: { id } },
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    return this.userRepo.findOneBy({
      id,
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({
      email,
    });
  }

  async create(entity: CreateUserDto) {
    const userFound = await this.findByEmail(entity.email);
    if (userFound) throw new BadRequestException('Email in use');

    const user = this.userRepo.create({ ...entity, role: Role.ADMIN });
    const HASHED_PASS = await bcrypt.hash(user.password, 10);
    user.password = HASHED_PASS;
    this.userRepo.save(user);
    return user;
  }

  async createClient(entity: CreateCustomerDto) {
    try {
      const userFound = await this.findByEmail(entity.email);
      if (userFound) throw new BadRequestException('Email in use');

      const customer: CreateCustomerDto = {
        name: entity.name,
        lastName: '',
        phone: '',
      };
      const newCustomer = await this.customerService.create(customer);
      const user = this.userRepo.create({ ...entity, role: Role.CUSTOMER });
      const HASHED_PASS = await bcrypt.hash(user.password, 10);
      user.password = HASHED_PASS;
      if (newCustomer) {
        user.customer = newCustomer;
      }
      const newUser = await this.userRepo.save(user);
      return newUser;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, payload: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    this.userRepo.merge(user, payload);
    return this.userRepo.save(user);
  }

  async updateCustomer(id: number, payload: UpdateCustomerDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    await this.customerService.update(user?.customer?.id, payload);
    return user;
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    if (user?.customer?.id) {
      await this.customerService.delete(user?.customer?.id);
    }
    return this.userRepo.softDelete({ id });
  }
}
