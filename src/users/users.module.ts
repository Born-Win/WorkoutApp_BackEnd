import { Module } from '@nestjs/common';
import { User } from './models';
import { UserRepository } from './repositories/user';
import { UserAuthService } from './services/users.auth';

@Module({
  providers: [
    UserAuthService,
    UserRepository,
    {
      provide: 'USER',
      useValue: User
    }
  ],
  exports: [UserAuthService]
})
export class UserModule {}
