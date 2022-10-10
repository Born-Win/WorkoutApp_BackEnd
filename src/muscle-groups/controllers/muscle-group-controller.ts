import { Controller, Get } from '@nestjs/common';
import { MuscleGroupService } from '../services/muscle-group';

@Controller()
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Get('/groups')
  async getMuscleGroupList() {
    const muscleGroupList = await this.muscleGroupService.getMuscleGroupList();

    return {
      code: 1,
      items: muscleGroupList
    };
  }
}
