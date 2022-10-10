import { Sequelize } from 'sequelize-typescript';
import config = require('config');
import * as muscleGroupsModelBuilders from '../muscle-groups/models';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(config.get<string>('postgresql.url'));

      await sequelize.authenticate();

      const models: Record<string, any> = {};

      const modelBuilders = [...Object.values(muscleGroupsModelBuilders)];

      modelBuilders.forEach((builder) => {
        const model = builder(sequelize);
        models[model.tableName] = model;
      });

      await sequelize.sync({ alter: true });

      return { sequelize, models };
    }
  }
];
