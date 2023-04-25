import axios from 'axios';
import config = require('config');
import { NestApplication } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import { App } from '../../../src/app/app';
import { DEFAULT_USERS } from '../../consts';
import { createRequestCookieHeaders, loginUser } from '../auth/utils';

describe('Muscle groups API', () => {
  const authAdminData = {
    email: DEFAULT_USERS.ADMIN_1.EMAIL,
    password: DEFAULT_USERS.ADMIN_1.PASSWORD
  };
  const PORT = process.env.PORT || 3000;
  const muscleGroupsApi = `${config.get('apiDomain')}/muscle-groups`;
  const muscleGroups = [
    {
      id: 1,
      name: 'Chest'
    },
    {
      id: 2,
      name: 'Back'
    },
    {
      id: 3,
      name: 'Arms'
    },
    {
      id: 4,
      name: 'Legs'
    },
    {
      id: 5,
      name: 'Shoulders'
    },
    {
      id: 6,
      name: 'Abs'
    }
  ];
  let app: NestApplication;
  let cookies: string[];

  beforeAll(async () => {
    app = await App.createApp();
    await app.listen(PORT);
    ({ cookies } = await loginUser(
      config.get<string>('apiDomain'),
      authAdminData
    ));
  });

  it('Should return all muscle groups', async () => {
    const result = await axios.get(
      muscleGroupsApi,
      createRequestCookieHeaders(cookies)
    );
    expect(result.status).toEqual(HttpStatus.OK);
    expect(result.data.items).toEqual(expect.arrayContaining(muscleGroups));
  });
});
