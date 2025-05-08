import { NestFactory } from '@nestjs/core';
import { ConsumerAppModule } from './consumer-app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(ConsumerAppModule);
  const config = new DocumentBuilder()
    .setTitle('Consumer App')
    .setDescription('API that reacts to producer app events')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
