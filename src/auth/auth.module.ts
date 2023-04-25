import config = require('config');
import { Module } from '@nestjs/common';
import { UserModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../libs/passport/strategies/local.strategy';
import { JwtStrategy } from '../libs/passport/strategies/jwt.strategy';
import { AuthController } from './controllers';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: config.get('jwt.accessToken.secret'),
      signOptions: { expiresIn: config.get('jwt.accessToken.expirationTime') }
    })
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy]
})
export class AuthModule {}
