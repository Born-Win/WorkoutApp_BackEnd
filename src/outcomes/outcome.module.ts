import { Module } from '@nestjs/common';
import { Outcome } from './models';
import { OutcomeController } from './controllers';
import { OutcomeService } from './services';
import { OutcomeRepository } from './repositories';
import { SetModule } from '../sets/set.module';

@Module({
  imports: [SetModule],
  controllers: [OutcomeController],
  providers: [
    OutcomeService,
    OutcomeRepository,
    {
      provide: 'OUTCOME',
      useValue: Outcome
    }
  ]
})
export class OutcomeModule {}
