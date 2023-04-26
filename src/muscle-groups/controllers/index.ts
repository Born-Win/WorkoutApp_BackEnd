import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { MuscleGroupService } from '../services';
import { MuscleGroupReadDto } from '../dto';

@ApiExtraModels(MuscleGroupReadDto)
@ApiTags('Muscle-groups')
@UseGuards(JwtAuthGuard)
@Controller('muscle-groups')
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @ApiUnauthorizedResponse(HTTP_EXCEPTION_DEFAULT_RESPONSE)
  @ApiOkResponse(
    generateSuccessfulContentObject({
      items: {
        type: 'array',
        items: {
          $ref: getSchemaPath(MuscleGroupReadDto)
        }
      }
    })
  )
  @ApiCookieAuth('accessToken')
  @Get()
  async getAll() {
    const muscleGroupList = await this.muscleGroupService.getAll();

    return {
      success: true,
      items: muscleGroupList
    };
  }
}
