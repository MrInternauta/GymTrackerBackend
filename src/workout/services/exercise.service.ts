import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IExerciseDto } from '../dtos/IExercise.dto';
import { IExercise } from '../entities/IExercise.entity';

@Injectable()
export class ExerciseService {
  constructor(@InjectRepository(IExercise) private exerciseRepo: Repository<IExercise>) {}

  findAll(skip: number, take: number): Promise<Array<IExercise>> {
    if (skip >= 0 && take) {
      return this.exerciseRepo.find({
        take,
        skip,
      });
    }
    return this.exerciseRepo.find();
  }

  findOne(id: number): Promise<IExercise> {
    return this.exerciseRepo.findOneBy({ id });
  }

  findByName(name: string): Promise<IExercise> {
    return this.exerciseRepo.findOneBy({
      name,
    });
  }

  async create(entity: IExerciseDto) {
    try {
      const Exercise = await this.findByName(entity.name);
      if (Exercise) throw new BadRequestException('The exercise name is already in use');
      const newExercise = await this.exerciseRepo.create(entity);
      return await this.exerciseRepo.save(newExercise);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async update(id: number, payload: IExerciseDto) {
    try {
      const Exercise = await this.findOne(id);
      if (!Exercise) {
        throw new NotFoundException('The exercise was not found');
      }
      this.exerciseRepo.merge(Exercise, payload);
      return await this.exerciseRepo.save(Exercise);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async delete(id: number) {
    try {
      const Exercise = await this.findOne(id);
      if (!Exercise) {
        throw new NotFoundException('The exercise was not found');
      }
      return this.exerciseRepo.softDelete({ id });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
