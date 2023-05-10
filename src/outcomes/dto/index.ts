import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SetReadDto } from '../../sets/dto';

export class OutcomeCreateWithSetsDto {
  @ApiProperty()
  weight: string;
  @ApiPropertyOptional()
  comment?: string;
  @ApiProperty()
  date: string;
  @ApiProperty({
    isArray: true,
    type: 'object',
    example: {
      reps: 'string',
      comment: 'string'
    }
  })
  sets: {
    reps: string;
    comment?: string;
  }[];

  constructor(data) {
    this.weight = data.weight;
    this.comment = data.comment ?? null;
    this.date = data.date;
    this.sets = data.sets;
  }
}

export class OutcomeCreateDto {
  @ApiProperty()
  weight: string;
  @ApiPropertyOptional()
  comment?: string;
  @ApiProperty()
  date: string;
  @ApiProperty()
  exercise_id: number;

  constructor(data) {
    this.weight = data.weight;
    this.comment = data.comment ?? null;
    this.date = data.date;
    this.exercise_id = data.exercise_id;
  }
}

export class OutcomeReadDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  weight: string;
  @ApiPropertyOptional()
  comment?: string;
  @ApiProperty()
  date: string;

  constructor(data) {
    this.id = data.id;
    this.weight = data.weight;
    this.comment = data.comment;
    this.date = data.date;
  }
}

export class OutcomeReadWithSetsDto {
  id: number;
  @ApiProperty()
  weight: string;
  @ApiPropertyOptional()
  comment?: string;
  @ApiProperty()
  date: string;
  @ApiProperty({ isArray: true, type: SetReadDto })
  sets: SetReadDto[];

  constructor(data) {
    this.id = data.id;
    this.weight = data.weight;
    this.comment = data.comment;
    this.date = data.date;
    this.sets = (Array.isArray(data.sets) ? data.sets : []).map(
      set => new SetReadDto(set)
    );
  }
}
