import { faker } from '@faker-js/faker';
import axios from 'axios';
import { HttpStatus } from '@nestjs/common';
import { MUSCLE_GROUPS_DATA } from '../../consts';
import { ExerciseCreateDto, ExerciseReadDto } from '../../../src/exercises/dto';

export async function createExercise(
  exercisesApi: string,
  requestCookieHeaders: { headers: { Cookie: string[] } },
  userId: number
) {
  // 1. create exercise
  const exerciseData: ExerciseCreateDto = {
    user_id: userId,
    name: faker.word.noun(),
    muscle_group_id: MUSCLE_GROUPS_DATA[0].id
  };
  const creationResult = await axios.post(
    exercisesApi,
    exerciseData,
    requestCookieHeaders
  );
  expect(creationResult.status).toEqual(HttpStatus.CREATED);
  expect(creationResult.data.item).toMatchObject(exerciseData);

  const createdExerciseId = creationResult.data.item.id;

  // 2. get just created exercise
  const getExerciseResult = await axios.get(
    `${exercisesApi}/view/${createdExerciseId}`,
    requestCookieHeaders
  );
  expect(getExerciseResult.status).toEqual(HttpStatus.OK);
  expect(getExerciseResult.data.item).toMatchObject({
    ...exerciseData,
    id: createdExerciseId
  });

  return creationResult.data.item as ExerciseReadDto;
}
