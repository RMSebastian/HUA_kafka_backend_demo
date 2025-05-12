import { Module } from '@nestjs/common';
import { ConsumerAppController } from './consumer-app.controller';
import { ConsumerAppService } from './consumer-app.service';
import { ConfigModule } from '@nestjs/config';
import { ConsumerAppEventHandler } from './consumer-app.eventHandler';
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConsumerAppController, ConsumerAppEventHandler],
  providers: [ConsumerAppService],
})
export class ConsumerAppModule {}
