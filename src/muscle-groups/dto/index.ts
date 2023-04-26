import { ApiProperty } from '@nestjs/swagger';

export class MuscleGroupReadDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
  }
}
