import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MuscleGroupModule } from '../muscle-groups/muscle-group.module';
import { UserModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { databaseProviders } from '../libs/sequelize';
import { HttpExceptionFilter } from '../exception-filters';

@Module({
  imports: [MuscleGroupModule, UserModule, AuthModule],
  providers: [
    ...databaseProviders,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
