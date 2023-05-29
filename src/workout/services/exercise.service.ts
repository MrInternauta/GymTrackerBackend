import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IExerciseDto } from '../dtos/IExercise.dto';
import { IExercise } from '../entities/IExercise.entity';
import { EquipmentService } from './equipment.service';
import { MuscleService } from './muscle.service';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(IExercise) private exerciseRepo: Repository<IExercise>,
    private muscleService: MuscleService,
    private equipmentService: EquipmentService
  ) {}

  findAll(skip: number, take: number): Promise<Array<IExercise>> {
    if (skip >= 0 && take) {
      return this.exerciseRepo.find({
        take,
        skip,
      });
    }
    return this.exerciseRepo.find();
  }

  findOne(id: number, relations = false): Promise<IExercise> {
    return this.exerciseRepo.findOne({
      where: { id },
      relations: relations ? ['equipment', 'musclesTarget'] : [],
    });
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

      if (!entity?.musclesTarget?.length) {
        throw new BadRequestException('Muscles target is required');
      }

      if (!entity?.equipmentId) {
        throw new BadRequestException('The equipment is required');
      }

      const musclesTarget = await this.muscleService.findByIds(entity?.musclesTarget);

      if (!musclesTarget?.length) {
        throw new BadRequestException('Muscles target is required');
      }

      const equipment = await this.equipmentService.findOne(entity.equipmentId);

      const newExercisEntity = await this.exerciseRepo.create({
        name: entity.name,
        description: entity.description,
        musclesTarget,
        equipment,
      });

      return await this.exerciseRepo.save(newExercisEntity);
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
      if (payload?.name !== Exercise?.name) {
        const Exercise2 = await this.findByName(payload.name);
        if (Exercise2) throw new BadRequestException('The exercise name is already in use');
      }

      if (!payload?.musclesTarget?.length) {
        throw new BadRequestException('Muscles target is required');
      }

      if (!payload?.equipmentId) {
        throw new BadRequestException('The equipment is required');
      }

      const musclesTarget = await this.muscleService.findByIds(payload?.musclesTarget);

      if (!musclesTarget?.length) {
        throw new BadRequestException('Muscles target is required');
      }

      const equipment = await this.equipmentService.findOne(payload.equipmentId);

      this.exerciseRepo.merge(Exercise, {
        name: payload.name,
        description: payload.description,
        musclesTarget,
        equipment,
      });

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
