import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SetCreateDto {
  reps: string;
  comment?: string;
  outcome_id: number;

  constructor(data) {
    this.reps = data.reps;
    this.comment = data.comment ?? null;
    this.outcome_id = data.outcome_id;
  }
}

export class SetReadDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  reps: string;
  @ApiPropertyOptional()
  comment?: string;
  @ApiProperty()
  outcome_id: number;

  constructor(data) {
    this.id = data.id;
    this.reps = data.reps;
    this.comment = data.comment ?? null;
    this.outcome_id = data.outcome_id;
  }
}
