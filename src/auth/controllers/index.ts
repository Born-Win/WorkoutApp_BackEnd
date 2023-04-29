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
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath
} from '@nestjs/swagger';
import {
  HTTP_EXCEPTION_DEFAULT_RESPONSE,
  setHttpExceptionResponseMessageProps,
  generateSuccessfulContentObject
} from '../../libs/swagger';
import { UserAuthService } from '../../users/services/users.auth';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { UserLoginDto, UserRegistrationDto } from '../dto';
import { UserReadDto } from '../../users/dto';
import { JoiValidationPipe } from '../../pipes/joi';
import { authValidationSchema } from '../validation/schemas';

@ApiExtraModels(UserReadDto)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @ApiUnprocessableEntityResponse(
    setHttpExceptionResponseMessageProps({
      default: 'The email has already been taken'
    })
  )
  @ApiBadRequestResponse(
    setHttpExceptionResponseMessageProps({
      default: 'Password and confirmation password do not match'
    })
  )
  @ApiCreatedResponse(
    generateSuccessfulContentObject({
      user: {
        $ref: getSchemaPath(UserReadDto)
      }
    })
  )
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
      if (err.name === 'SequelizeUniqueConstraintError') {
        throw new UnprocessableEntityException(
          'The email has already been taken'
        );
      }
      throw err;
    }
  }

  @ApiUnauthorizedResponse(
    setHttpExceptionResponseMessageProps({
      examples: ['Incorrect login', 'Incorrect email']
    })
  )
  @ApiBadRequestResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiForbiddenResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiOkResponse({
    headers: {
      ['Set-Cookie']: {
        description: 'JWT token',
        schema: {
          type: 'string',
          example: 'accessToken=; Path=/; HttpOnly'
        }
      },
      ['Set-Cookie\0']: {
        description: 'JWT token',
        schema: {
          type: 'string',
          example: 'refreshToken=; Path=/; HttpOnly'
        }
      }
    },
    ...generateSuccessfulContentObject()
  })
  @ApiBody({
    type: UserLoginDto
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) response) {
    await this.userAuthService.loginUser(req.user, req.cookies, response);

    return {
      success: true
    };
  }

  @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiForbiddenResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({
    headers: {
      ['Set-Cookie']: {
        description: 'JWT token',
        schema: {
          type: 'string',
          example: 'accessToken=; Path=/; HttpOnly'
        }
      },
      ['Set-Cookie\0']: {
        description: 'JWT token',
        schema: {
          type: 'string',
          example: 'refreshToken=; Path=/; HttpOnly'
        }
      }
    },
    ...generateSuccessfulContentObject()
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) response) {
    await this.userAuthService.refreshTokens(req.cookies, response);

    return {
      success: true
    };
  }
}
