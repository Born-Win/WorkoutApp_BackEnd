import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Param,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCookieAuth,
  getSchemaPath,
  ApiExtraModels
} from '@nestjs/swagger';
import {
  HTTP_EXCEPTION_DEFAULT_RESPONSE,
  generateSuccessfulContentObject
} from '../../libs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { OutcomeService } from '../services';
import { JoiValidationPipe } from '../../pipes/joi';
import { outcomeValidationSchema } from '../validation/schemas';
import { OutcomeCreateDto, OutcomeCreateWithSetsDto } from '../dto';

// @ApiExtraModels(MuscleGroupReadDto)
@ApiTags('Outcomes')
@UseGuards(JwtAuthGuard)
@Controller('outcomes')
export class OutcomeController {
  constructor(private readonly outcomeService: OutcomeService) {}

  @UsePipes(new JoiValidationPipe(outcomeValidationSchema.getAll))
  @Get('all')
  async getAll(@Query() query: { exercise_id: string; date?: string }) {
    const exerciseId = +query.exercise_id;
    const outcomes = await this.outcomeService.getAllByExercise(exerciseId);

    return {
      success: true,
      items: outcomes
    };
  }

  // @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  // @ApiOkResponse(
  //   generateSuccessfulContentObject({
  //     items: {
  //       type: 'array',
  //       items: {
  //         $ref: getSchemaPath(MuscleGroupReadDto)
  //       }
  //     }
  //   })
  // )
  // @ApiCookieAuth('accessToken')
  @UsePipes(new JoiValidationPipe(outcomeValidationSchema.create))
  @Post()
  async create(
    @Query() query: { exercise_id: string },
    @Body() body: { data: OutcomeCreateWithSetsDto[] }
  ) {
    const outcomeDataArray = body.data.map(
      outcome =>
        new OutcomeCreateWithSetsDto({
          ...outcome,
          ...query
        })
    );
    await this.outcomeService.create(outcomeDataArray);

    return {
      success: true
      // item: createdOutcome
    };
  }

  @UsePipes(new JoiValidationPipe(outcomeValidationSchema.updateOne))
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() body: { weight: string }) {
    await this.outcomeService.udpateOne(+id, body);

    return {
      success: true
    };
  }
}
