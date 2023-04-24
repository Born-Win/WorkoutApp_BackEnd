import { NestApplication } from '@nestjs/core';
import cookieParser = require('./cookie-parser');

export = (app: NestApplication) => {
  app.use(cookieParser);
};
