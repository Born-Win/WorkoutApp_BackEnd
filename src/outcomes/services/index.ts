import { Sequelize } from 'sequelize-typescript';
import _ = require('lodash');
import { Injectable, Inject } from '@nestjs/common';
import { SetService } from '../../sets/services';
import { OutcomeRepository } from '../repositories';
import {
  OutcomeCreateDto,
  OutcomeCreateWithSetsDto,
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

  async getAllByExercise(
    exerciseId: number,
    filters?: { date: string }
  ): Promise<OutcomeReadWithSetsDto[]> {
    const foundOutcomes = await this.outcomeRepository.findAll({
      exercise_id: exerciseId,
      ...filters
    });
    return foundOutcomes.map(outcome => new OutcomeReadWithSetsDto(outcome));
  }

  async create(
    exercise_id: number,
    outcomeDataArray: OutcomeCreateWithSetsDto[]
  ) {
    return this.sequelize.transaction(async transaction => {
      const outcomeToCreateArray = outcomeDataArray.map(
        outcomeWithSets =>
          new OutcomeCreateDto({
            exercise_id,
            ...outcomeWithSets
          })
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
          new OutcomeCreateDto({ ...outcome, exercise_id })
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

      await this.setService.create(setsToCreate, { transaction });
    });
  }
}
