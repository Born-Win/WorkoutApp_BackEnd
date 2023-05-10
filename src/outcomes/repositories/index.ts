import { Transaction } from 'sequelize';
import { Injectable, Inject } from '@nestjs/common';
import { safeToJson } from '../../libs/sequelize/utils';
import { Outcome } from '../models';
import { Set } from '../../sets/models';

type OutcomeData = {
  id: number;
  weight: string;
  exercise_id: number;
  sets: {
    id: number;
    reps: number;
    comment?: string;
    outcome_id: number;
  };
};

type OutcomeDataToCreate = {
  weight: string;
  exercise_id: number;
};

type Options = {
  transaction: Transaction;
};

@Injectable()
export class OutcomeRepository {
  constructor(
    @Inject('OUTCOME')
    private outcome: typeof Outcome
  ) {}

  async findAll(outcomeFilterOptions: Partial<OutcomeData>) {
    const result = await this.outcome.findAll({
      include: {
        model: Set,
        as: 'sets'
      },
      where: outcomeFilterOptions
    });
    return safeToJson(result);
  }

  async createOne(outcomeData: OutcomeDataToCreate, options?: Options) {
    const result = await this.outcome.create(outcomeData, options);
    return safeToJson(result);
  }

  async createMany(outcomeDataArray: OutcomeDataToCreate[], options?: Options) {
    const result = await this.outcome.bulkCreate(outcomeDataArray, options);
    return safeToJson(result);
  }
}
