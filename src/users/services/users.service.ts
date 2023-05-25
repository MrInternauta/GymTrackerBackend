import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  findAll(skip: number, take: number) {
    if (skip >= 0 && take) {
      return this.userRepo.find({
        take,
        skip,
      });
    }
    return this.userRepo.find();
  }

  findbyCustomerId(id: number) {
    return this.userRepo.find({
      where: { customer: { id } },
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async findOneWithCustomer(id: number) {
    return this.userRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({
      email,
    });
  }

  async findByEmailWithCustomer(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: { email },
      relations: ['customer'],
    });
  }

  async create(entity: CreateUserDto) {
    try {
      const userFound = await this.findByEmail(entity.email);
      if (userFound) throw new BadRequestException('The email address is already in use');

      const user = this.userRepo.create({ ...entity, role: Role.ADMIN });
      const HASHED_PASS = await bcrypt.hash(user.password, 10);
      user.password = HASHED_PASS;
      this.userRepo.save(user);
      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async createClient(entity: CreateCustomerDto) {
    try {
      const userFound = await this.findByEmail(entity.email);
      if (userFound) throw new BadRequestException('The email address is already in use');

      const newCustomer = await this.customerService.create(entity);
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
      throw new BadRequestException(error);
    }
  }

  async update(id: number, payload: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException('User was not found');
      }
      this.userRepo.merge(user, payload);
      return this.userRepo.save(user);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async updateCustomer(id: number, payload: UpdateCustomerDto) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException('User was not found');
      }
      await this.customerService.update(user?.customer?.id, payload);
      return user;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async delete(id: number) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException('User was not found');
      }
      if (user?.customer?.id) {
        await this.customerService.delete(user?.customer?.id);
      }
      return this.userRepo.softDelete({ id });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
