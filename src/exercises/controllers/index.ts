import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCookieAuth,
  getSchemaPath,
  ApiExtraModels,
  ApiCreatedResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import {
  HTTP_EXCEPTION_DEFAULT_RESPONSE,
  generateSuccessfulContentObject,
  setHttpExceptionResponseMessageProps
} from '../../libs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { ExerciseService } from '../services';
import {
  ExerciseCreateDto,
  ExerciseReadDto,
  ExerciseShortReadDto
} from '../dto';
import { JoiValidationPipe } from '../../pipes/joi';
import { exerciseValidationSchema } from '../validation/schemas';

@ApiExtraModels(ExerciseReadDto, ExerciseShortReadDto)
@ApiTags('Exercises')
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiNotFoundResponse(
    setHttpExceptionResponseMessageProps({
      default: 'Exercise with id = "${id}" not found'
    })
  )
  @ApiOkResponse(
    generateSuccessfulContentObject({
      item: {
        $ref: getSchemaPath(ExerciseReadDto)
      }
    })
  )
  @ApiCookieAuth('accessToken')
  @Get('view/:id')
  async getOne(@Param('id') id: string) {
    const exercise = await this.exerciseService.getOne(id);

    return {
      success: true,
      item: exercise
    };
  }

  @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiBadRequestResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiOkResponse(
    generateSuccessfulContentObject({
      items: {
        type: 'array',
        items: {
          $ref: getSchemaPath(ExerciseShortReadDto)
        }
      }
    })
  )
  @ApiCookieAuth('accessToken')
  @UsePipes(new JoiValidationPipe(exerciseValidationSchema.getAll))
  @Get('all')
  async getAll(@Query() query: { muscle_group_id: string }, @Req() req) {
    const exercises = await this.exerciseService.getAll(
      req.user.id,
      +query.muscle_group_id
    );

    return {
      success: true,
      items: exercises
    };
  }

  @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiBadRequestResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiConflictResponse(
    setHttpExceptionResponseMessageProps({
      default:
        'You already have exercise with name "${exercise_name}". Try another one'
    })
  )
  @ApiCreatedResponse(
    generateSuccessfulContentObject({
      item: {
        $ref: getSchemaPath(ExerciseReadDto)
      }
    })
  )
  @ApiCookieAuth('accessToken')
  @UsePipes(new JoiValidationPipe(exerciseValidationSchema.createOne))
  @Post()
  async createOne(@Body() body: ExerciseCreateDto) {
    const createdExercise = await this.exerciseService.createOne(body);

    return {
      success: true,
      item: createdExercise
    };
  }

  @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiBadRequestResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiConflictResponse(
    setHttpExceptionResponseMessageProps({
      default:
        'You already have exercise with name "${exercise_name}". Try another one'
    })
  )
  @ApiOkResponse(generateSuccessfulContentObject())
  @ApiBody({
    schema: { type: 'object', properties: { name: { type: 'string' } } }
  })
  @ApiCookieAuth('accessToken')
  @UsePipes(new JoiValidationPipe(exerciseValidationSchema.renameOne))
  @Patch('rename/:id')
  async renameOne(@Param('id') id: string, @Body() body: { name: string }) {
    await this.exerciseService.renameOne(id, body.name);

    return {
      success: true
    };
  }

  @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiOkResponse(generateSuccessfulContentObject())
  @ApiCookieAuth('accessToken')
  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    await this.exerciseService.removeOne(id);

    return {
      success: true
    };
  }
}
