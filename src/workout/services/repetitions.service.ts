import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IRepetitionsDto } from '../dtos/IRepetitions.dto';
import { IRepetitions } from '../entities/IRepetitions.entity';

@Injectable()
export class RepetitionsService {
  constructor(@InjectRepository(IRepetitions) private RepetitionsRepo: Repository<IRepetitions>) {}

  findAll(skip: number, take: number): Promise<Array<IRepetitions>> {
    if (skip >= 0 && take) {
      return this.RepetitionsRepo.find({
        take,
        skip,
      });
    }
    return this.RepetitionsRepo.find();
  }

  findOne(id: number): Promise<IRepetitions> {
    return this.RepetitionsRepo.findOneBy({ id });
  }

  async create(entity: IRepetitionsDto) {
    try {
      const newRepetitions = await this.RepetitionsRepo.create(entity);
      return await this.RepetitionsRepo.save(newRepetitions);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async update(id: number, payload: IRepetitionsDto) {
    try {
      const Repetitions = await this.findOne(id);
      if (!Repetitions) {
        throw new NotFoundException('The repetitions was not found');
      }
      this.RepetitionsRepo.merge(Repetitions, payload);
      return await this.RepetitionsRepo.save(Repetitions);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async delete(id: number) {
    try {
      const Repetitions = await this.findOne(id);
      if (!Repetitions) {
        throw new NotFoundException('Repetitions was not found');
      }
      return this.RepetitionsRepo.softDelete({ id });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
