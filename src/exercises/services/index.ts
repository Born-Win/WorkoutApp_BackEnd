import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';
import { ExerciseRepository } from '../repositories';
import {
  ExerciseCreateDto,
  ExerciseReadDto,
  ExerciseShortReadDto
} from '../dto';

@Injectable()
export class ExerciseService {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async getOne(id: string) {
    const foundExercise = await this.exerciseRepository.findOneById(id);

    if (!foundExercise) {
      throw new NotFoundException(`Exercise with id = "${id}" not found`);
    }

    return new ExerciseReadDto(foundExercise);
  }

  async getAll(user_id: number, muscle_group_id: number) {
    const exercises = await this.exerciseRepository.findAll({
      user_id,
      muscle_group_id
    });

    return exercises.map(exercise => new ExerciseShortReadDto(exercise));
  }

  async createOne(user_id: number, exerciseData: ExerciseCreateDto) {
    try {
      const createdExercise = await this.exerciseRepository.createOne({
        user_id,
        ...exerciseData
      });
      return new ExerciseShortReadDto(createdExercise);
    } catch (err) {
      if (
        err instanceof UniqueConstraintError &&
        err.parent?.message?.match(
          'duplicate key value violates unique constraint'
        )
      ) {
        throw new ConflictException(
          `You already have exercise with name "${exerciseData.name}". Try another one`
        );
      }

      throw err;
    }
  }

  async renameOne(id: string, name: string) {
    try {
      await this.exerciseRepository.updateOneById(id, { name });
    } catch (err) {
      if (
        err instanceof UniqueConstraintError &&
        err.parent?.message?.match(
          'duplicate key value violates unique constraint'
        )
      ) {
        throw new ConflictException(
          `You already have exercise with name "${name}". Try another one`
        );
      }

      throw err;
    }
  }

  async removeOne(id: string) {
    return this.exerciseRepository.removeOneById(id);
  }
}
