import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use('/uploads', express.static('./public'));
  app.setGlobalPrefix('api/v1');

  await app.listen(8888);
  Logger.log(`Listened on PORT ${process.env.PORT}`);
}
bootstrap();
