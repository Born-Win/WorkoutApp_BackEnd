import { Module } from '@nestjs/common';
import { MuscleGroup } from './models';
import { MuscleGroupController } from './controllers';
import { MuscleGroupService } from './services';
import { MuscleGroupRepository } from './repositories';

@Module({
  controllers: [MuscleGroupController],
  providers: [
    MuscleGroupService,
    MuscleGroupRepository,
    {
      provide: 'MUSCLE_GROUP',
      useValue: MuscleGroup
    }
  ]
})
export class MuscleGroupModule {}
