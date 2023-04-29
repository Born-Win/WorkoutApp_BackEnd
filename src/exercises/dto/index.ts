import { ApiProperty } from '@nestjs/swagger';

export class ExerciseCreateDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  user_id: number;
  @ApiProperty()
  muscle_group_id: number;

  constructor(data) {
    this.name = data.name;
    this.user_id = data.user_id;
    this.muscle_group_id = data.muscle_group_id;
  }
}

export class ExerciseReadDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  user_id: number;
  @ApiProperty()
  muscle_group_id: number;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.user_id = data.user_id;
    this.muscle_group_id = data.muscle_group_id;
  }
}
