import { Controller, Get, UseGuards } from '@nestjs/common';
import { MuscleGroupService } from '../services';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('muscle-groups')
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Get()
  async getAll() {
    const muscleGroupList = await this.muscleGroupService.getAll();

    return {
      success: true,
      items: muscleGroupList
    };
  }
}
