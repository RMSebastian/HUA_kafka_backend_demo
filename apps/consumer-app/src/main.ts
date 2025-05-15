import { NestFactory } from '@nestjs/core';
import { ConsumerAppModule } from './consumer-app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLoggerService } from './logs/log.service';
import { NewrelicInterceptor } from '../interceptors/newrelic.interceptor';
import 'newrelic';
async function bootstrap() {
  const app = await NestFactory.create(ConsumerAppModule, {
    bufferLogs: true,
    // timestamp: true,
  });

  if (process.env.LOGGER_URL) {
    app.useLogger(app.get(CustomLoggerService));
  }

  app.useGlobalInterceptors(new NewrelicInterceptor());

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
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID ?? 'default-group',
      },
      run: {
        autoCommit: false,
      },
    },
  });

  await app.startAllMicroservices();
  app.listen(Number(process.env.PORT) || 3002);
}
bootstrap();
