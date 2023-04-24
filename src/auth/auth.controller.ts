import {
  Controller,
  Body,
  Post,
  UseGuards,
  Req,
  Res,
  UsePipes,
  UnprocessableEntityException,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { UserAuthService } from '../users/services/users.auth';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserRegistrationDto } from './dto';
import { JoiValidationPipe } from '../pipes/joi';
import { authValidationSchema } from './validation/schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @UsePipes(new JoiValidationPipe(authValidationSchema.register))
  @Post('register')
  async register(
    @Body() userData: UserRegistrationDto,
    @Res({ passthrough: true }) response
  ) {
    try {
      const registredUser = await this.userAuthService.registerUser(userData);
      await this.userAuthService.loginUser(registredUser, {}, response);

      return {
        success: true,
        user: registredUser
      };
    } catch (err) {
      if (
        err.name === 'MongoServerError' &&
        err.message.match('duplicate key error')
      ) {
        throw new UnprocessableEntityException(
          'The email has already been taken'
        );
      }
      throw err;
    }
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) response) {
    await this.userAuthService.loginUser(req.user, req.cookies, response);

    return {
      success: true
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) response) {
    await this.userAuthService.refreshTokens(req.cookies, response);

    return {
      success: true
    };
  }
}
