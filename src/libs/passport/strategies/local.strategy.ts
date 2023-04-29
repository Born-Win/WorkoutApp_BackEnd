import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JoiValidationPipe } from '../../../pipes/joi';
import { UserAuthService } from '../../../users/services/users.auth';
import { UserReadDto } from '../../../users/dto';
import { authValidationSchema } from '../../../auth/validation/schemas';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly joiValidationPipe: JoiValidationPipe;

  constructor(private userAuthService: UserAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
    this.joiValidationPipe = new JoiValidationPipe(authValidationSchema.login);
  }

  async validate(email: string, password: string): Promise<UserReadDto> {
    try {
      // validate the input data first
      this.joiValidationPipe.transform({ email, password }, { type: 'body' });

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
