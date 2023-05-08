import { Injectable, Inject } from '@nestjs/common';
import { Exercise } from '../models';

type ExerciseDataToCreate = {
  name: string; // 2-30 characters
  user_id: number;
  muscle_group_id: number;
};

@Injectable()
export class ExerciseRepository {
  constructor(
    @Inject('EXERCISE')
    private exercise: typeof Exercise
  ) {}

  findAll(params: Partial<ExerciseDataToCreate>) {
    return this.exercise.findAll({ where: params });
  }

  findOneById(id: string) {
    return this.exercise.findByPk(id);
  }

  createOne(exerciseData: ExerciseDataToCreate) {
    return this.exercise.create(exerciseData);
  }

  updateOneById(id: string, exerciseData: Partial<ExerciseDataToCreate>) {
    return this.exercise.update(exerciseData, { where: { id } });
  }

  removeOneById(id: string) {
    return this.exercise.destroy({ where: { id } });
  }
}
