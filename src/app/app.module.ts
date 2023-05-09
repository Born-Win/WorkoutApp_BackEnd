import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalModule } from './global.module';
import { MuscleGroupModule } from '../muscle-groups/muscle-group.module';
import { UserModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ExerciseGroupModule } from '../exercises/exercise.module';
import { OutcomeModule } from '../outcomes/outcome.module';
import { SetModule } from '../sets/set.module';
import * as ExceptionFilters from '../exception-filters';

@Module({
  imports: [
    GlobalModule,
    MuscleGroupModule,
    UserModule,
    AuthModule,
    ExerciseGroupModule,
    OutcomeModule,
    SetModule
  ],
  providers: [
    ...Object.values(ExceptionFilters).map(filter => ({
      provide: APP_FILTER,
      useClass: filter
    }))
  ]
})
export class AppModule {}
