import { Injectable } from '@nestjs/common';

import { EquipmentService } from './equipment.service';
import { ExerciseService } from './exercise.service';
import { MuscleService } from './muscle.service';
import { RepetitionsService } from './repetitions.service';
import { RoutineService } from './routine.service';

@Injectable()
export class WorkoutService {
  constructor(
    public equipmentService: EquipmentService,
    public exerciseService: ExerciseService,
    public muscleService: MuscleService,
    public repetitionsService: RepetitionsService,
    public routineService: RoutineService
  ) {}
}
