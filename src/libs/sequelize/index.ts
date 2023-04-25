import { Sequelize } from 'sequelize-typescript';
import config = require('config');
import { User } from '../../users/models';
import { MuscleGroup } from '../../muscle-groups/models';
import { Exercise } from '../../exercises/models';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(config.get<string>('postgresql.url'));

      await sequelize.authenticate();

      const models: Record<string, any> = {};

      sequelize.addModels([User, MuscleGroup, Exercise]);

      await sequelize.sync({ alter: true });

      return { sequelize, models };
    }
  }
];