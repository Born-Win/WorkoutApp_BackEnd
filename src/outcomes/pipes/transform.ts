import moment = require('moment');
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { OutcomeCreateWithSetsDto } from '../dto';

@Injectable()
export class CreationBodyPipeTransform implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const outcomeDataArray = value.data.map(
      d => new OutcomeCreateWithSetsDto(d)
    ) as OutcomeCreateWithSetsDto[];

    try {
      for (const outcome of outcomeDataArray) {
        if (!moment(outcome.date).isValid()) {
          throw new Error('Outcome date is invalid');
        }
        outcome.date = moment(outcome.date).format('YYYY-MM-DD');
      }
      return value;
    } catch (err) {
      throw new Error('Outcome date is invalid');
    }
  }
}
