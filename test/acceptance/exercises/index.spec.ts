import axios from 'axios';
import config = require('config');
import { faker } from '@faker-js/faker';
import { NestApplication } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import { App } from '../../../src/app/app';
import { UserReadDto } from '../../../src/users/dto';
import { UserRegistrationDto } from '../../../src/auth/dto';
import {
  ExerciseCreateDto,
  ExerciseReadDto,
  ExerciseShortReadDto
} from '../../../src/exercises/dto';
import { DEFAULT_USER_PASSWORD, MUSCLE_GROUPS_DATA } from '../../consts';
import { createRequestCookieHeaders } from '../auth/utils';
import { createExercise } from './utils';

describe('Exercises API', () => {
  const PORT = process.env.PORT || 3000;
  const authApi = `${config.get('apiDomain')}/auth`;
  const exercisesApi = `${config.get('apiDomain')}/exercises`;
  let app: NestApplication;

  beforeAll(async () => {
    app = await App.createApp();
    await app.listen(PORT);
  });

  let createdUser: UserReadDto;
  let cookies: string[];

  beforeEach(async () => {
    const userDataToCreate: UserRegistrationDto = {
      email: faker.random.word() + '@fakemail.com',
      password: DEFAULT_USER_PASSWORD,
      confirmation_password: DEFAULT_USER_PASSWORD
    };

    const result = await axios.post(`${authApi}/register`, userDataToCreate);
    expect(result.status).toEqual(HttpStatus.CREATED);
    expect(result.data.user.email).toEqual(userDataToCreate.email);
    expect(result.headers['set-cookie'].length).toEqual(2);
    expect(
      result.headers['set-cookie'].find(element =>
        element.match('refreshToken')
      )
    ).not.toBeUndefined();
    expect(
      result.headers['set-cookie'].find(element => element.match('accessToken'))
    ).not.toBeUndefined();

    createdUser = result.data.user;
    cookies = result.headers['set-cookie'];
  });

  describe('Get', () => {
    it('should return all created exercises by muscle group', async () => {
      const requestCookieHeaders = createRequestCookieHeaders(cookies);

      // 1. create exercises
      const createdExercises: ExerciseShortReadDto[] = [];

      const muscleGroupId = MUSCLE_GROUPS_DATA[0].id;

      for (let i = 0; i < 2; i++) {
        const exerciseData: ExerciseCreateDto = {
          user_id: createdUser.id,
          name: faker.word.noun(),
          muscle_group_id: muscleGroupId
        };
        const creationResult = await axios.post(
          exercisesApi,
          exerciseData,
          requestCookieHeaders
        );
        expect(creationResult.status).toEqual(HttpStatus.CREATED);
        expect(creationResult.data.item).toMatchObject(exerciseData);

        const { id, name } = creationResult.data.item as ExerciseReadDto;
        createdExercises.push({
          id,
          name
        });
      }

      // 2. get just created exercises
      const getExercisesResult = await axios.get(`${exercisesApi}/all`, {
        ...requestCookieHeaders,
        params: {
          muscle_group_id: muscleGroupId
        }
      });
      expect(getExercisesResult.status).toEqual(HttpStatus.OK);
      expect(getExercisesResult.data.items).toEqual(
        expect.arrayContaining(createdExercises)
      );
    });
  });

  describe('Create', () => {
    it('Should return create and return exercise', async () => {
      // 1. create exercise
      const exerciseData: ExerciseCreateDto = {
        user_id: createdUser.id,
        name: faker.word.noun(),
        muscle_group_id: MUSCLE_GROUPS_DATA[0].id
      };
      const creationResult = await axios.post(
        exercisesApi,
        exerciseData,
        createRequestCookieHeaders(cookies)
      );
      expect(creationResult.status).toEqual(HttpStatus.CREATED);
      expect(creationResult.data.item).toMatchObject(exerciseData);

      const createdExerciseId = creationResult.data.item.id;

      // 2. get just created exercise
      const getExerciseResult = await axios.get(
        `${exercisesApi}/view/${createdExerciseId}`,
        createRequestCookieHeaders(cookies)
      );
      expect(getExerciseResult.status).toEqual(HttpStatus.OK);
      expect(getExerciseResult.data.item).toMatchObject({
        ...exerciseData,
        id: createdExerciseId
      });
    });

    it('Should return conflict creating error of duplicated exercise', async () => {
      // 1. create exercise
      const exerciseData: ExerciseCreateDto = {
        user_id: createdUser.id,
        name: faker.word.noun(),
        muscle_group_id: MUSCLE_GROUPS_DATA[0].id
      };
      const creationResult = await axios.post(
        exercisesApi,
        exerciseData,
        createRequestCookieHeaders(cookies)
      );
      expect(creationResult.status).toEqual(HttpStatus.CREATED);
      expect(creationResult.data.item).toMatchObject(exerciseData);

      const createdExerciseId = creationResult.data.item.id;

      // 2. get just created exercise
      const getExerciseResult = await axios.get(
        `${exercisesApi}/view/${createdExerciseId}`,
        createRequestCookieHeaders(cookies)
      );
      expect(getExerciseResult.status).toEqual(HttpStatus.OK);
      expect(getExerciseResult.data.item).toMatchObject({
        ...exerciseData,
        id: createdExerciseId
      });

      // 3. create the same exercise again
      const repeatedCreationResult = await axios.post(
        exercisesApi,
        exerciseData,
        {
          ...createRequestCookieHeaders(cookies),
          validateStatus: null
        }
      );
      expect(repeatedCreationResult.status).toEqual(HttpStatus.CONFLICT);
      expect(repeatedCreationResult.data.message).toEqual(
        `You already have exercise with name "${exerciseData.name}". Try another one`
      );
    });
  });

  describe('Rename', () => {
    it('Should rename exercise', async () => {
      const requestCookieHeaders = createRequestCookieHeaders(cookies);

      // 1. create exercise
      const createdExercise = await createExercise(
        exercisesApi,
        requestCookieHeaders,
        createdUser.id
      );

      const { id: exerciseId } = createdExercise;

      // 2. rename created exercise
      const updatedExerciseData = {
        name: createdExercise.name + '_updated'
      };
      const renamingResult = await axios.patch(
        `${exercisesApi}/rename/${exerciseId}`,
        updatedExerciseData,
        requestCookieHeaders
      );
      expect(renamingResult.status).toEqual(HttpStatus.OK);

      // 3. get renamed exercise
      const getExerciseResult = await axios.get(
        `${exercisesApi}/view/${exerciseId}`,
        requestCookieHeaders
      );
      expect(getExerciseResult.status).toEqual(HttpStatus.OK);
      expect(getExerciseResult.data.item).toMatchObject({
        ...createdExercise,
        ...updatedExerciseData, // rewrite name
        id: exerciseId
      });
    });

    it('Should return conflict renaming error of duplicated exercise', async () => {
      const requestCookieHeaders = createRequestCookieHeaders(cookies);

      const createdExercises: ExerciseReadDto[] = [];

      // 1. create two exercises
      for (let i = 0; i < 2; i++) {
        const createdExercise = await createExercise(
          exercisesApi,
          requestCookieHeaders,
          createdUser.id
        );

        createdExercises.push(createdExercise);
      }

      const { id: exerciseId } = createdExercises[0];

      // 2. rename exercise
      const updatedExerciseData = {
        name: createdExercises[1].name
      };
      const renamingResult = await axios.patch(
        `${exercisesApi}/rename/${exerciseId}`,
        updatedExerciseData,
        {
          ...requestCookieHeaders,
          validateStatus: null
        }
      );
      expect(renamingResult.status).toEqual(HttpStatus.CONFLICT);
      expect(renamingResult.data.message).toEqual(
        `You already have exercise with name "${updatedExerciseData.name}". Try another one`
      );
    });
  });

  it('Should delete exercise', async () => {
    const requestCookieHeaders = createRequestCookieHeaders(cookies);

    // 1. create exercise
    const createdExercise = await createExercise(
      exercisesApi,
      requestCookieHeaders,
      createdUser.id
    );

    const { id: exerciseId } = createdExercise;

    // 2. delete created exercise
    const deletionResult = await axios.delete(
      `${exercisesApi}/${exerciseId}`,
      requestCookieHeaders
    );
    expect(deletionResult.status).toEqual(HttpStatus.OK);

    // 3. check deletion
    const getExerciseResult = await axios.get(
      `${exercisesApi}/view/${exerciseId}`,
      {
        ...requestCookieHeaders,
        validateStatus: null
      }
    );
    expect(getExerciseResult.status).toEqual(HttpStatus.NOT_FOUND);
    expect(getExerciseResult.data.message).toEqual(
      `Exercise with id = "${exerciseId}" not found`
    );
  });
});
