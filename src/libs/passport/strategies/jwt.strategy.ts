import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import config = require('config');
import { cookiesExtractor } from '../cookies-extractor';
import { promisifyJwtSign } from '../../jsonwebtoken/promisify-jwt-sign';

const options = {
  secretOrKey: config.get<string>('jwt.accessToken.secret'),
  ignoreExpiration: false,
  passReqToCallback: true,
  jwtFromRequest: cookiesExtractor
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(options);
  }

  async validate(req, payload) {
    try {
      const token = req.cookies.accessToken;
      await promisifyJwtSign(token, options.secretOrKey);

      return payload;
    } catch (err) {
      throw err;
    }
  }
}
