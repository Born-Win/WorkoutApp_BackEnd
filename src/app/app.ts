import { NestApplication, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

    const config = new DocumentBuilder()
      .setTitle('Workout app API documentation')
      .setVersion('1.0')
      .addCookieAuth(
        'accessToken',
        {
          type: 'http',
          in: 'cookie',
          scheme: 'Bearer'
        },
        'accessToken'
      )
      .addCookieAuth(
        'refreshToken',
        {
          type: 'http',
          in: 'cookie',
          scheme: 'Bearer'
        },
        'refreshToken'
      )
      .build();
    const document = SwaggerModule.createDocument(App.app, config);
    SwaggerModule.setup('api', App.app, document);

    return App.app;
  }
}
