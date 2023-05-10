import { Transaction } from 'sequelize';
import { Injectable, Inject } from '@nestjs/common';
import { Set } from '../../sets/models';

type SetDataToCreate = {
  reps: string;
  comment?: string;
  outcome_id: number;
};

type Options = {
  transaction: Transaction;
};

@Injectable()
export class SetRepository {
  constructor(
    @Inject('SET')
    private set: typeof Set
  ) {}

  createOne(setDat: SetDataToCreate, options?: Options) {
    return this.set.create(setDat, options);
  }

  createMany(setDataArray: SetDataToCreate[], options?: Options) {
    return this.set.bulkCreate(setDataArray, options);
  }
}
