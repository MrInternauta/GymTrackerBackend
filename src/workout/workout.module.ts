import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { EquipmentController } from './controllers/equipment.controller';
import { ExerciseController } from './controllers/exercise.controller';
import { MuscleController } from './controllers/muscle.controller';
import { RoutineController } from './controllers/routine.controller';
import { IEquipment } from './entities/IEquipment.entity';
import { IExercise } from './entities/IExercise.entity';
import { IMuscle } from './entities/IMuscle.entity';
import { IRoutine } from './entities/IRoutine.entity';
import { EquipmentService } from './services/equipment.service';
import { ExerciseService } from './services/exercise.service';
import { MuscleService } from './services/muscle.service';
import { RoutineService } from './services/routine.service';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([IEquipment, IExercise, IMuscle, IRoutine])],
  providers: [EquipmentService, ExerciseService, MuscleService, RoutineService],
  exports: [EquipmentService, ExerciseService, MuscleService, RoutineService],
  controllers: [EquipmentController, ExerciseController, MuscleController, RoutineController],
})
export class WorkoutModule {}
