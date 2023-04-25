import axios from 'axios';
import config = require('config');
import { faker } from '@faker-js/faker';
import { NestApplication } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import { App } from '../../../src/app/app';
import { DEFAULT_USERS } from '../../consts';
import { UserRegistrationDto } from '../../../src/auth/dto';

const DEFAULT_USER_PASSWORD = '123456';

describe('Auth API', () => {
  const PORT = process.env.PORT || 3000;
  const authApi = `${config.get('apiDomain')}/auth`;
  let app: NestApplication;

  beforeAll(async () => {
    app = await App.createApp();
    await app.listen(PORT);
  });

  describe('Register', () => {
    it('Should create new user and return tokens in cookies', async () => {
      const userDataToCreate: UserRegistrationDto = {
        email: faker.random.word() + '@fakemail.com',
        password: DEFAULT_USER_PASSWORD,
        confirmation_password: DEFAULT_USER_PASSWORD
      };
      const result = await axios.post(`${authApi}/register`, userDataToCreate);
      expect(result.status).toEqual(HttpStatus.CREATED);
      expect(result.data).toMatchObject({ success: true });
      expect(result.headers['set-cookie'].length).toEqual(2);
      expect(
        result.headers['set-cookie'].find(element =>
          element.match('refreshToken')
        )
      ).not.toBeUndefined();
      expect(
        result.headers['set-cookie'].find(element =>
          element.match('accessToken')
        )
      ).not.toBeUndefined();
    });

    it('Should return duplicated email error', async () => {
      // 1. create user
      const userDataToCreate: UserRegistrationDto = {
        email: faker.random.word() + '@fakemail.com',
        password: DEFAULT_USER_PASSWORD,
        confirmation_password: DEFAULT_USER_PASSWORD
      };
      const creationResult = await axios.post(
        `${authApi}/register`,
        userDataToCreate
      );
      expect(creationResult.status).toEqual(HttpStatus.CREATED);

      // 2. create the same user
      const repeatedCreationResult = await axios.post(
        `${authApi}/register`,
        userDataToCreate,
        {
          validateStatus: null
        }
      );
      expect(repeatedCreationResult.status).toEqual(
        HttpStatus.UNPROCESSABLE_ENTITY
      );
      expect(repeatedCreationResult.data).toMatchObject({
        success: false,
        message: 'The email has already been taken'
      });
    });
  });

  describe('Login', () => {
    it('Should return tokens in cookies', async () => {
      const userToLogin = {
        email: DEFAULT_USERS.ADMIN_1.EMAIL,
        password: DEFAULT_USERS.ADMIN_1.PASSWORD
      };
      const result = await axios.post(`${authApi}/login`, userToLogin);
      expect(result.status).toEqual(HttpStatus.OK);
      expect(result.data).toMatchObject({ success: true });
      expect(result.headers['set-cookie'].length).toEqual(2);
      expect(
        result.headers['set-cookie'].find(element =>
          element.match('refreshToken')
        )
      ).not.toBeUndefined();
      expect(
        result.headers['set-cookie'].find(element =>
          element.match('accessToken')
        )
      ).not.toBeUndefined();
    });

    it('Should return incorrect password error', async () => {
      const userToLogin = {
        email: DEFAULT_USERS.ADMIN_1.EMAIL,
        password: `${DEFAULT_USERS.ADMIN_1.PASSWORD}${faker.word.noun()}` // incorrect password
      };
      const result = await axios.post(`${authApi}/login`, userToLogin, {
        validateStatus: null
      });
      expect(result.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(result.data).toMatchObject({
        success: false,
        message: 'Incorrect password'
      });
    });

    it('Should update tokens and return them', async () => {
      // 1. login
      const userToLogin = {
        email: DEFAULT_USERS.ADMIN_1.EMAIL,
        password: DEFAULT_USERS.ADMIN_1.PASSWORD
      };
      const loginResult = await axios.post(`${authApi}/login`, userToLogin);
      expect(loginResult.status).toEqual(HttpStatus.OK);
      expect(loginResult.data).toMatchObject({ success: true });

      expect(loginResult.headers['set-cookie'].length).toEqual(2);

      // 2. refresh tokens
      const refreshResult = await axios.post(`${authApi}/refresh`, null, {
        headers: {
          Cookie: loginResult.headers['set-cookie']
        },
        validateStatus: null
      });
      expect(refreshResult.status).toEqual(HttpStatus.OK);
      expect(refreshResult.headers['set-cookie'].length).toEqual(4);
      const updatedRefreshToken = refreshResult.headers['set-cookie'].find(
        element => element.match('refreshToken=;')
      );
      expect(updatedRefreshToken).not.toBeUndefined();
      const refreshToken = loginResult.headers['set-cookie'].find(
        element => element.match('refreshToken') && element.match('HttpOnly')
      );
      expect(updatedRefreshToken).not.toEqual(refreshToken);
      const accessToken = loginResult.headers['set-cookie'].find(
        element => element.match('accessToken') && element.match('HttpOnly')
      );
      const updatedAccessToken = refreshResult.headers['set-cookie'].find(
        element => element.match('accessToken=;')
      );
      expect(updatedAccessToken).not.toBeUndefined();
      expect(updatedAccessToken).not.toEqual(accessToken);
    });

    it('Should return forbidden error', async () => {
      // 1. login
      const userToLogin = {
        email: DEFAULT_USERS.ADMIN_1.EMAIL,
        password: DEFAULT_USERS.ADMIN_1.PASSWORD
      };

      const loginResult = await axios.post(`${authApi}/login`, userToLogin);
      expect(loginResult.status).toEqual(HttpStatus.OK);
      expect(loginResult.headers['set-cookie'].length).toEqual(2);

      // need to delay to sign another token
      await new Promise(r => setTimeout(r, 2000));

      // 2. login again
      const repeatedLoginResult = await axios.post(
        `${authApi}/login`,
        userToLogin
      );
      expect(repeatedLoginResult.status).toEqual(HttpStatus.OK);
      expect(repeatedLoginResult.headers['set-cookie'].length).toEqual(2);

      // 3. login with old refresh token
      const loginWithOldTokenResult = await axios.post(
        `${authApi}/login`,
        userToLogin,
        {
          headers: {
            Cookie: loginResult.headers['set-cookie']
          },
          validateStatus: null
        }
      );

      expect(loginWithOldTokenResult.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });
});
