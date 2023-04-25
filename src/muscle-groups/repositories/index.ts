import { Injectable, Inject } from '@nestjs/common';
import { MuscleGroup } from '../models';

@Injectable()
export class MuscleGroupRepository {
  constructor(
    @Inject('MUSCLE_GROUP')
    private muscleGroup: typeof MuscleGroup
  ) {}

  findAll() {
    return this.muscleGroup.findAll();
  }
}
