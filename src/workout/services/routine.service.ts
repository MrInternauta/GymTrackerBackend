import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IRepetitionsRoutinesDto } from '../dtos/IRepetitionsRoutines.dto';
import { IRoutineDto } from '../dtos/IRoutine.dto';
import { IRoutine } from '../entities/IRoutine.entity';
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
      payload.repetitionsWeight = payload?.repetitionsWeight?.filter(item => item);
      //Get repetitions
      if (!payload?.repetitionsWeight?.length) {
        throw new BadRequestException(`The repetitions of '${exercise?.name}' are required`);
      }
      // const repetitionRoutine = await this.repetitionsRoutineRepo.create({
      //   exercise,
      //   repetitions: repetitions,
      //   routine: Routine,
      // });
      // console.log(repetitionRoutine);
      // await this.repetitionsRoutineRepo.save(repetitionRoutine);

      const newRoutine = {
        ...Routine,
      };
      payload?.repetitionsWeight;

      newRoutine.repetitions.push();

      return await this.RoutineRepo.merge(Routine, newRoutine);
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
