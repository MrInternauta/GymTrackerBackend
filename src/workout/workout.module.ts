import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { EquipmentController } from './controllers/equipment.controller';
import { ExerciseController } from './controllers/exercise.controller';
import { MuscleController } from './controllers/muscle.controller';
import { RepetitionsController } from './controllers/repetitions.controller';
import { RoutineController } from './controllers/routine.controller';
import { IEquipment } from './entities/IEquipment.entity';
import { IExercise } from './entities/IExercise.entity';
import { IMuscle } from './entities/IMuscle.entity';
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
    TypeOrmModule.forFeature([IEquipment, IExercise, IMuscle, IRepetitions, IRepetitionsRoutines, IRoutine]),
  ],
  providers: [WorkoutService, EquipmentService, ExerciseService, MuscleService, RepetitionsService, RoutineService],
  exports: [WorkoutService, EquipmentService, ExerciseService, MuscleService, RepetitionsService, RoutineService],
  controllers: [EquipmentController, ExerciseController, MuscleController, RepetitionsController, RoutineController],
})
export class WorkoutModule {}
