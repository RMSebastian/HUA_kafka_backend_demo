import 'newrelic';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLoggerService } from './logs/log.service';
import { ConsumerAppModule } from './consumer-app.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerAppModule, {
    bufferLogs: true,
  });

  if (process.env.LOGGER_URL) {
    app.useLogger(app.get(CustomLoggerService));
  }

  const config = new DocumentBuilder()
    .setTitle('Consumer API')
    .setDescription('API de consumidor con Kafka')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.listen(Number(process.env.PORT) || 3002);
}
bootstrap();
