import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export class App {
  private static app: NestApplication;

  static async createApp() {
    if (App.app) {
      return App.app;
    }

    App.app = await NestFactory.create(AppModule);

    // eslint-disable-next-line
    require('../middlewares')(App.app);

    return App.app;
  }
}
