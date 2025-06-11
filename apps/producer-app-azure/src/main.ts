import { NestFactory } from '@nestjs/core';
import { ProducerAppAzureModule } from './producer-app-azure.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ProducerAppAzureModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Producer App Azure')
    .setDescription('API that produces events for consumer app')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(Number(process.env.PORT) || 3003);
}
bootstrap();
