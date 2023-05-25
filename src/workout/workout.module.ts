import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { IEquipment } from './entities/IEquipment.entity';
import { IExercise } from './entities/IExercise.entity';
import { IMuscles } from './entities/IMuscles.entity';
import { IRepetitions } from './entities/IRepetitions.entity';
import { IRepetitionsRoutines } from './entities/IRepetitionsRoutines.entity';
import { IRoutine } from './entities/IRoutine.entity';
import { EquipmentService } from './services/equipment.service';
import { ExerciseService } from './services/exercise.service';
import { MuscleService } from './services/muscle.service';
import { RepetitionsService } from './services/repetitions.service';
import { RoutineService } from './services/routine.service';
import { WorkoutService } from './services/workout.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([IEquipment, IExercise, IMuscles, IRepetitions, IRepetitionsRoutines, IRoutine]),
  ],
  providers: [WorkoutService, EquipmentService, ExerciseService, MuscleService, RepetitionsService, RoutineService],
  exports: [WorkoutService, EquipmentService, ExerciseService, MuscleService, RepetitionsService, RoutineService],
  // exports: [UsersService, CustomersService],
  // providers: [UsersService, CustomersService],
  // controllers: [UsersController, OrdersController, ProfileController],
})
export class WorkoutModule {}
