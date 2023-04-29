import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MuscleGroupModule } from '../muscle-groups/muscle-group.module';
import { UserModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ExerciseGroupModule } from '../exercises/exercise.module';
import { databaseProviders } from '../libs/sequelize';
import * as ExceptionFilters from '../exception-filters';

@Module({
  imports: [MuscleGroupModule, UserModule, AuthModule, ExerciseGroupModule],
  providers: [
    ...databaseProviders,
    ...Object.values(ExceptionFilters).map(filter => ({
      provide: APP_FILTER,
      useClass: filter
    }))
  ]
})
export class AppModule {}
