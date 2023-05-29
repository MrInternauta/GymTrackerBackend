import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IRepetitionsRoutinesDto } from '../dtos/IRepetitionsRoutines.dto';
import { IRoutineDto } from '../dtos/IRoutine.dto';
import { IRoutine } from '../entities/IRoutine.entity';
import { IRepetitions } from '../models/IRepetitions';
import { IRepetitionsRoutines } from '../models/IRepetitionsRoutines';
import { ExerciseService } from './exercise.service';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(IRoutine) private RoutineRepo: Repository<IRoutine>,
    private exerciseService: ExerciseService
  ) {}

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

  async create(routineDto: IRoutineDto) {
    try {
      const Routine = await this.findByName(routineDto.name);
      if (Routine) throw new BadRequestException('The routine name is already in use');
      const newRoutine = await this.RoutineRepo.create({
        name: routineDto.name,
        description: routineDto.description,
      });
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
      if (payload?.name !== Routine?.name) {
        const Routine = await this.findByName(payload.name);
        if (Routine) throw new BadRequestException('The routine name is already in use');
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

  async addReps(id: number, payload: IRepetitionsRoutinesDto) {
    try {
      const Routine = await this.findOne(id);
      if (!Routine) {
        throw new NotFoundException('The routine was not found');
      }
      //Check if the exercise already exists
      const exercise = await this.exerciseService.findOne(payload?.exerciseId);
      if (!exercise) {
        throw new NotFoundException(`The exercise '${payload?.exerciseId}' was not found`);
      }
      payload.repetitionsWeight = payload?.repetitionsWeight?.filter(item => item?.length);
      //Get repetitions
      if (!payload?.repetitionsWeight?.length) {
        throw new BadRequestException(`The repetitions of '${exercise?.name}' are required`);
      }

      const newRoutine = {
        ...Routine,
      };

      const repetitions: Array<IRepetitions> = payload?.repetitionsWeight.map(rep => ({
        reps: rep[0],
        weight: rep[1],
      }));

      if (!newRoutine?.repetitions) {
        newRoutine.repetitions = [];
      }

      const existSerie = newRoutine.repetitions.find(
        item => item?.exercise === payload?.exerciseId && item?.serieExercise === payload?.serieExercise
      );
      if (!existSerie) {
        const respRoutine: IRepetitionsRoutines = {
          exercise: payload?.exerciseId,
          serieExercise: payload?.serieExercise ?? 1,
          repetitions,
        };
        newRoutine.repetitions.push(respRoutine);
      } else {
        existSerie.repetitions = repetitions;
      }

      await this.RoutineRepo.merge(Routine, newRoutine);
      return await this.RoutineRepo.save(Routine);
    } catch (error) {
      console.log(error);

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
