import { Module } from '@nestjs/common';
import { Exercise } from './models';
import { ExerciseController } from './controllers';
import { ExerciseService } from './services';
import { ExerciseRepository } from './repositories';

@Module({
  controllers: [ExerciseController],
  providers: [
    ExerciseService,
    ExerciseRepository,
    {
      provide: 'EXERCISE',
      useValue: Exercise
    }
  ]
})
export class ExerciseGroupModule {}
