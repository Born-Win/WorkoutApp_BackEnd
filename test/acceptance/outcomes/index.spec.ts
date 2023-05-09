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
import { DEFAULT_USER_PASSWORD } from '../../consts';
import { createRequestCookieHeaders } from '../auth/utils';
import { createExercise } from '../exercises/utils';
import { OutcomeCreateWithSetsDto } from '../../../src/outcomes/dto';

describe('Outcomes API', () => {
  const PORT = process.env.PORT || 3000;
  const authApi = `${config.get('apiDomain')}/auth`;
  const exercisesApi = `${config.get('apiDomain')}/exercises`;
  const outcomesApi = `${config.get('apiDomain')}/outcomes`;
  let app: NestApplication;

  beforeAll(async () => {
    app = await App.createApp();
    await app.listen(PORT);
  });

  let createdUser: UserReadDto;
  let createdExercise: ExerciseReadDto;
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

    createdExercise = await createExercise(
      exercisesApi,
      createRequestCookieHeaders(cookies),
      createdUser.id
    );
  });

  describe('Create', () => {
    it('should return create outcomes', async () => {
      const requestCookieHeaders = createRequestCookieHeaders(cookies);

      // 1. create outcomes
      const outcomesDataToCreate: Omit<OutcomeCreateWithSetsDto, 'exercise_id'>[] = [
        {
          weight: faker.random.numeric(),
          comment: faker.random.word(),
          sets: [
            {
              reps: +faker.random.numeric(),
              comment: faker.random.word()
            },
            {
              reps: +faker.random.numeric()
            }
          ]
        },
        {
          weight: faker.random.numeric(),
          sets: [
            {
              reps: +faker.random.numeric()
            },
            {
              reps: +faker.random.numeric()
            }
          ]
        }
      ];

      console.log(outcomesDataToCreate.at(0), outcomesDataToCreate.at(1));

      const createOutcomesResult = await axios.post(outcomesApi,
        { data: outcomesDataToCreate },
        {
        ...requestCookieHeaders,
        params: {
          exercise_id: createdExercise.id
        }
      });
      expect(createOutcomesResult.status).toEqual(HttpStatus.CREATED);

      // 2. get just created outcomes
      const getOutcomesResult = await axios.get(`${outcomesApi}/all`, {
        ...requestCookieHeaders,
        params: {
          exercise_id: createdExercise.id
        }
      });
      expect(getOutcomesResult.status).toEqual(HttpStatus.OK);
      // console.log(getOutcomesResult.data.items);
      expect(getOutcomesResult.data.items).toEqual(
        expect.arrayContaining(outcomesDataToCreate)
      );
    });
  });
});
