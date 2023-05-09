import { Transaction } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { SetRepository } from '../repositories';
import { SetCreateDto } from '../dto';

@Injectable()
export class SetService {
  constructor(private readonly setRepository: SetRepository) {}

  async create(
    setDataArray: SetCreateDto[],
    options?: { transaction: Transaction }
  ) {
    const createdSets =
      setDataArray.length > 1
        ? await this.setRepository.createMany(setDataArray, options)
        : [await this.setRepository.createOne(setDataArray[0], options)];

    return createdSets;
  }
}
