import { ApiProperty } from '@nestjs/swagger';

export class UserReadDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;

  constructor(data) {
    this.id = data.id;
    this.email = data.email;
  }
}
