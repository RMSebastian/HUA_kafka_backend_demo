import { Module } from '@nestjs/common';
import { ConsumerAppController } from './consumer-app.controller';
import { ConsumerAppService } from './consumer-app.service';

@Module({
  imports: [],
  controllers: [ConsumerAppController],
  providers: [ConsumerAppService],
})
export class ConsumerAppModule {}
