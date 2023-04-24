export class UserRegistrationDto {
  email: string;
  password: string;
  confirmation_password: string;

  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.confirmation_password = data.confirmation_password;
  }
}
