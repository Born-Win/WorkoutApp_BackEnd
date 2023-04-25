import { Injectable } from '@nestjs/common';
import { MuscleGroupRepository } from '../repositories';

@Injectable()
export class MuscleGroupService {
  constructor(private readonly muscleGroupRepository: MuscleGroupRepository) {}

  getAll() {
    return this.muscleGroupRepository.findAll();
  }
}
