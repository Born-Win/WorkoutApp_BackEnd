import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserAuthService } from '../../../users/services/users.auth';
import { UserReadDto } from '../../../users/dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userAuthService: UserAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: string, password: string): Promise<UserReadDto> {
    try {
      const validationResult = await this.userAuthService.validateUser(
        email,
        password
      );

      return validationResult;
    } catch (err) {
      throw err;
    }
  }
}
