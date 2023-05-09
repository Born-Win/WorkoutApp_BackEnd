import { Sequelize } from 'sequelize-typescript';
import _ = require('lodash');
import { Injectable, Inject } from '@nestjs/common';
import { SetService } from '../../sets/services';
import { OutcomeRepository } from '../repositories';
import {
  OutcomeCreateDto,
  OutcomeCreateWithSetsDto,
  OutcomeReadDto,
  OutcomeReadWithSetsDto
} from '../dto';
import { SetCreateDto } from '../../sets/dto';

@Injectable()
export class OutcomeService {
  constructor(
    private readonly outcomeRepository: OutcomeRepository,
    private readonly setService: SetService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize
  ) {}

  async getAllByExercise(exerciseId: number, filters?: { date: string }) {
    const foundOutcomes = await this.outcomeRepository.findAll({
      exercise_id: exerciseId,
      ...filters
    });
    return foundOutcomes.map(outcome => new OutcomeReadWithSetsDto(outcome));
  }

  async create(outcomeDataArray: OutcomeCreateWithSetsDto[]) {
    return this.sequelize.transaction(async transaction => {
      const outcomeToCreateArray = outcomeDataArray.map(
        outcomeWithSets => new OutcomeCreateDto(outcomeWithSets)
      );

      const createdOutcomes =
        outcomeToCreateArray.length > 1
          ? await this.outcomeRepository.createMany(outcomeToCreateArray, {
              transaction
            })
          : [
              await this.outcomeRepository.createOne(outcomeToCreateArray[0], {
                transaction
              })
            ];

      const setsToCreate: SetCreateDto[] = [];

      for (const outcome of outcomeDataArray) {
        const foundOutcome = _.find(
          createdOutcomes,
          new OutcomeCreateDto(outcome)
        ) as OutcomeCreateWithSetsDto & { id: number };

        if (!foundOutcome) {
          continue;
        }

        outcome.sets.forEach(set => {
          setsToCreate.push(
            new SetCreateDto({
              ...set,
              outcome_id: foundOutcome.id
            })
          );
        });
      }

      console.log(createdOutcomes);
      console.log(setsToCreate);

      await this.setService.create(setsToCreate, { transaction });
    });

    // const createdOutcome = await this.outcomeRepository.createOne(outcomeData);
    // return new OutcomeReadDto(createdOutcome);
  }

  async udpateOne(id: number, outcomeData: { weight: string }) {
    await this.outcomeRepository.updateOne(id, outcomeData);
  }
}
