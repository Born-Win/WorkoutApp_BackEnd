import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const valueToValidate = metadata.type ? { [metadata.type]: value } : value;
    const { error } = this.schema.validate(valueToValidate);
    if (error) {
      throw new BadRequestException(error.message);
    }
    return value;
  }
}
