import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus
} from '@nestjs/common';
import * as sequelize from 'sequelize';
import { Response } from 'express';

@Catch(sequelize.BaseError)
export class SequelizeExceptionFilter implements ExceptionFilter {
  catch(exception: sequelize.BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: exception.message
    });
  }
}
