import { NestFactory } from '@nestjs/core';
import { ConsumerAppModule } from './consumer-app.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerAppModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
