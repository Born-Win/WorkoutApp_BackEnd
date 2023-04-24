import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import config = require('config');
import { Injectable } from '@nestjs/common';
import {
  UnauthorizedException,
  ForbiddenException
} from '@nestjs/common/exceptions';
import { promisifyJwtSign } from '../../libs/jsonwebtoken/promisify-jwt-sign';
import { UserRepository } from '../repositories/user';
import { UserReadDto } from '../dto';
import { UserRegistrationDto } from '../../auth/dto';

export type Cookies = {
  accessToken?: string;
  refreshToken?: string;
};

@Injectable()
export class UserAuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(userData: UserRegistrationDto) {
    if (userData.password !== userData.confirmation_password) {
      throw new Error('Password and confirmation password do not match');
    }

    const createdUser = await this.userRepository.createOne(userData);

    return new UserReadDto(createdUser);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Incorrect login');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    return new UserReadDto(user);
  }

  async loginUser(user: UserReadDto, cookies: Cookies, response) {
    if (cookies.refreshToken) {
      return this.refreshTokens(cookies, response);
    }

    return this.updateTokens(user, response);
  }

  async refreshTokens(cookies: Cookies, response) {
    const { refreshToken } = cookies;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    response.clearCookie('refreshToken');
    response.clearCookie('accessToken');

    const foundUser = await this.userRepository.findOne({
      refresh_token: refreshToken
    });

    if (!foundUser) {
      await promisifyJwtSign(
        refreshToken,
        config.get('jwt.refreshToken.secret'),
        async (err, payload: jwt.JwtPayload, resolve) => {
          if (err) return resolve(true);

          await this.userRepository.updateOne(
            { email: payload.email },
            { refresh_token: '' }
          );

          resolve(true);
        }
      );

      throw new ForbiddenException();
    }

    await promisifyJwtSign(
      refreshToken,
      config.get('jwt.refreshToken.secret'),
      async (err, payload: jwt.JwtPayload, resolve) => {
        if (err || foundUser.email !== payload.email) {
          await this.userRepository.updateById(foundUser.id, {
            refresh_token: ''
          });

          throw new ForbiddenException();
        }

        await this.updateTokens(foundUser, response);

        resolve(true);
      }
    );
  }

  async updateTokens(user: UserReadDto, response) {
    const newRefreshToken = this.signJwtRefreshToken(user.email);

    response.cookie('refreshToken', newRefreshToken, {
      maxAge: config.get('jwt.refreshToken.expirationTime'),
      httpOnly: true
    });

    const newAccessToken = this.signJwtAccessToken(user);

    response.cookie('accessToken', newAccessToken, {
      maxAge: config.get('jwt.accessToken.expirationTime'),
      httpOnly: true
    });

    await this.userRepository.updateById(user.id, {
      refresh_token: newRefreshToken
    });
  }

  private signJwtAccessToken(user: UserReadDto) {
    const jwtPayload = {
      id: user.id,
      email: user.email
    };

    return jwt.sign(jwtPayload, config.get('jwt.accessToken.secret'), {
      expiresIn: config.get('jwt.accessToken.expirationTime')
    });
  }

  private signJwtRefreshToken(email: string) {
    return jwt.sign({ email }, config.get('jwt.refreshToken.secret'), {
      expiresIn: config.get('jwt.refreshToken.expirationTime')
    });
  }
}
