import { Injectable } from '@nestjs/common';
import { MuscleGroupRepository } from '../repositories';

@Injectable()
export class MuscleGroupService {
  constructor(private readonly muscleGroupRepository: MuscleGroupRepository) {}

  getMuscleGroupList() {
    return this.muscleGroupRepository.getGroups();
  }
}
