import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3020);
  console.log('vidalstore-admin escuchando en http://localhost:3020');
}
void bootstrap();