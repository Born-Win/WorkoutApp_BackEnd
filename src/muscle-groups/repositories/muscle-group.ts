import { Injectable, Inject } from '@nestjs/common';
import { MuscleGroup } from '../models/muscle-group';
import { Sequelize, ModelCtor, Model } from 'sequelize-typescript';

@Injectable()
export class MuscleGroupRepository {
  private readonly muscleGroup: MuscleGroup;

  constructor(
    @Inject('SEQUELIZE')
    db: {
      sequelize: Sequelize;
      models: Record<string, ModelCtor<Model>>;
    }
  ) {
    this.muscleGroup = db.models.muscle_groups;
  }

  getGroups() {
    return this.muscleGroup.findAll();
  }
}
