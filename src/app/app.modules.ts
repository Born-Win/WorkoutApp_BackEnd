import { Module } from '@nestjs/common';
import { MuscleGroupModule } from '../muscle-groups/module';
import { databaseProviders } from '../libs/sequelize';

@Module({
  imports: [MuscleGroupModule],
  providers: [...databaseProviders]
})
export class AppModule {}
