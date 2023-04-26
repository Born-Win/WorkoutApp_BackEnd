import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class UserRegistrationDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  confirmation_password: string;

  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.confirmation_password = data.confirmation_password;
  }
}
