import { Sequelize } from 'sequelize-typescript';
import config = require('config');
import { User } from '../../users/models';
import { MuscleGroup } from '../../muscle-groups/models';
import { Exercise } from '../../exercises/models/exercise';
import { Outcome } from '../../outcomes/models';
import { Set } from '../../sets/models';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(config.get<string>('postgresql.url'));

      await sequelize.authenticate();

      sequelize.addModels([User, MuscleGroup, Exercise, Outcome, Set]);

      await sequelize.sync({ alter: true });

      return sequelize;
    }
  }
];
