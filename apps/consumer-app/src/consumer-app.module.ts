import { Module } from '@nestjs/common';
import { ConsumerAppController } from './consumer-app.controller';
import { ConsumerAppService } from './consumer-app.service';
import { ConsumerAppEventHandler } from './consumer-app.event.handler';
import { KafkaProvider } from '@utils/kafka.provider';
import { ConsummerAppEventHandlerInit } from './consumer-app.event.handler.init';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [ConsumerAppController, ConsumerAppEventHandler],
  providers: [ConsumerAppService, KafkaProvider, ConsummerAppEventHandlerInit],
})
export class ConsumerAppModule {}
