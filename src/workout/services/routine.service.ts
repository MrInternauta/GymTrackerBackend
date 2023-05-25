import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IRoutineDto } from '../dtos/IRoutine.dto';
import { IRoutine } from '../entities/IRoutine.entity';

@Injectable()
export class RoutineService {
  constructor(@InjectRepository(IRoutine) private RoutineRepo: Repository<IRoutine>) {}

  findAll(skip: number, take: number): Promise<Array<IRoutine>> {
    if (skip >= 0 && take) {
      return this.RoutineRepo.find({
        take,
        skip,
      });
    }
    return this.RoutineRepo.find();
  }

  findOne(id: number): Promise<IRoutine> {
    return this.RoutineRepo.findOneBy({ id });
  }

  findByName(name: string): Promise<IRoutine> {
    return this.RoutineRepo.findOneBy({
      name,
    });
  }

  async create(entity: IRoutineDto) {
    try {
      const Routine = await this.findByName(entity.name);
      if (Routine) throw new BadRequestException('The routine name is already in use');
      const newRoutine = await this.RoutineRepo.create(entity);
      return await this.RoutineRepo.save(newRoutine);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async update(id: number, payload: IRoutineDto) {
    try {
      const Routine = await this.findOne(id);
      if (!Routine) {
        throw new NotFoundException('The routine was not found');
      }
      this.RoutineRepo.merge(Routine, payload);
      return await this.RoutineRepo.save(Routine);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async delete(id: number) {
    try {
      const Routine = await this.findOne(id);
      if (!Routine) {
        throw new NotFoundException('Routine was not found');
      }
      return this.RoutineRepo.softDelete({ id });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
