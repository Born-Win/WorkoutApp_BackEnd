export class UserReadDto {
  id: number;
  email: string;
  password: string;
  refresh_token: string;

  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.refresh_token = data.refresh_token;
  }
}
