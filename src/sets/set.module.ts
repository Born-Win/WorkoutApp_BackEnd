import { Module } from '@nestjs/common';
import { Set } from './models';
import { SetService } from './services';
import { SetRepository } from './repositories';

@Module({
  providers: [
    SetService,
    SetRepository,
    {
      provide: 'SET',
      useValue: Set
    }
  ],
  exports: [SetService]
})
export class SetModule {}
