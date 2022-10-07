import { Module } from '@nestjs/common';
import * as MuscleGroupControllers from '../controllers';
import * as MuscleGroupServices from '../services';
import * as MuscleGroupRepositories from '../repositories';
import { databaseProviders } from '../../libs/sequelize';

@Module({
  controllers: [...Object.values(MuscleGroupControllers)],
  providers: [
    ...Object.values(MuscleGroupServices),
    ...Object.values(MuscleGroupRepositories),
    ...databaseProviders
  ]
})
export class MuscleGroupModule {}
