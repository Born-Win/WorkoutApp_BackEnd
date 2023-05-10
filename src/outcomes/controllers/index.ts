import {
  Controller,
  Get,
  Post,
  Body,
  Query,
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
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiParam
} from '@nestjs/swagger';
import {
  HTTP_EXCEPTION_DEFAULT_RESPONSE,
  generateSuccessfulContentObject
} from '../../libs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { OutcomeService } from '../services';
import { JoiValidationPipe } from '../../pipes/joi';
import { CreationBodyPipeTransform } from '../pipes/transform';
import { outcomeValidationSchema } from '../validation/schemas';
import { OutcomeCreateWithSetsDto, OutcomeReadWithSetsDto } from '../dto';
import { SetReadDto } from '../../sets/dto';

@ApiExtraModels(OutcomeCreateWithSetsDto, OutcomeReadWithSetsDto, SetReadDto)
@ApiTags('Outcomes')
@UseGuards(JwtAuthGuard)
@Controller('outcomes')
export class OutcomeController {
  constructor(private readonly outcomeService: OutcomeService) {}

  @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiBadRequestResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiOkResponse(
    generateSuccessfulContentObject({
      items: {
        type: 'array',
        items: {
          $ref: getSchemaPath(OutcomeReadWithSetsDto)
        }
      }
    })
  )
  @ApiCookieAuth('accessToken')
  @UsePipes(new JoiValidationPipe(outcomeValidationSchema.getAll))
  @Get('all')
  async getAll(@Query() query: { exercise_id: string; date?: string }) {
    const exerciseId = +query.exercise_id;
    const outcomes = await this.outcomeService.getAllByExercise(
      exerciseId,
      query.date ? { date: query.date } : null
    );

    return {
      success: true,
      items: outcomes
    };
  }

  @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiBadRequestResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiCreatedResponse(generateSuccessfulContentObject())
  @ApiCookieAuth('accessToken')
  @ApiParam({
    name: 'exercise_id',
    schema: {
      type: 'string'
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(OutcomeCreateWithSetsDto)
          }
        }
      }
    }
  })
  @UsePipes(
    new CreationBodyPipeTransform(),
    new JoiValidationPipe(outcomeValidationSchema.create)
  )
  @Post()
  async create(
    @Query() query: { exercise_id: string },
    @Body() body: { data: OutcomeCreateWithSetsDto[] }
  ) {
    await this.outcomeService.create(+query.exercise_id, body.data);

    return {
      success: true
    };
  }
}
