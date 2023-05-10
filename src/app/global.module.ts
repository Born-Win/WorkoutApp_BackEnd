import { databaseProviders } from '../libs/sequelize';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders.map(({ provide }) => provide)]
})
export class GlobalModule {}
