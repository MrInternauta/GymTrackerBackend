import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IMusclesDto } from '../dtos/IMuscles.dto';
import { IMuscles } from '../entities/IMuscles.entity';

@Injectable()
export class MuscleService {
  constructor(@InjectRepository(IMuscles) private muscleRepo: Repository<IMuscles>) {}

  findAll(skip: number, take: number): Promise<Array<IMuscles>> {
    if (skip >= 0 && take) {
      return this.muscleRepo.find({
        take,
        skip,
      });
    }
    return this.muscleRepo.find();
  }

  findOne(id: number): Promise<IMuscles> {
    return this.muscleRepo.findOneBy({ id });
  }

  findByName(name: string): Promise<IMuscles> {
    return this.muscleRepo.findOneBy({
      name,
    });
  }

  async create(entity: IMusclesDto) {
    try {
      const muscle = await this.findByName(entity.name);
      if (muscle) throw new BadRequestException('The muscle name is already in use');
      const newMuscle = await this.muscleRepo.create(entity);
      return await this.muscleRepo.save(newMuscle);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async update(id: number, payload: IMusclesDto) {
    try {
      const muscle = await this.findOne(id);
      if (!muscle) {
        throw new NotFoundException('The muscle was not found');
      }
      this.muscleRepo.merge(muscle, payload);
      return await this.muscleRepo.save(muscle);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async delete(id: number) {
    try {
      const muscle = await this.findOne(id);
      if (!muscle) {
        throw new NotFoundException('muscle was not found');
      }
      return this.muscleRepo.softDelete({ id });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
