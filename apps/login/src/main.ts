import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ValidationPipe } from '@nestjs/common';
import configuration from 'config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(configuration.apiPort);
}
bootstrap();
