import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { IMuscleDto } from '../dtos/IMuscle.dto';
import { IMuscle } from '../entities/IMuscle.entity';

@Injectable()
export class MuscleService {
  constructor(@InjectRepository(IMuscle) private muscleRepo: Repository<IMuscle>) {}

  findAll(skip: number, take: number): Promise<Array<IMuscle>> {
    if (skip >= 0 && take) {
      return this.muscleRepo.find({
        take,
        skip,
      });
    }
    return this.muscleRepo.find();
  }

  findOne(id: number): Promise<IMuscle> {
    return this.muscleRepo.findOneBy({ id });
  }

  findByName(name: string): Promise<IMuscle> {
    return this.muscleRepo.findOneBy({
      name,
    });
  }

  findByIds(id: Array<number>): Promise<Array<IMuscle>> {
    return this.muscleRepo.findBy({ id: In(id) });
  }

  async create(entity: IMuscleDto) {
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

  async update(id: number, payload: IMuscleDto) {
    try {
      const muscle = await this.findOne(id);
      if (!muscle) {
        throw new NotFoundException('The muscle was not found');
      }

      if (payload?.name !== muscle?.name) {
        const muscle = await this.findByName(payload.name);
        if (muscle) throw new BadRequestException('The muscle name is already in use');
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
