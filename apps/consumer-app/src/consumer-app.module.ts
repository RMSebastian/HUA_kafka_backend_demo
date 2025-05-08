import { Module } from '@nestjs/common';
import { ConsumerAppController } from './consumer-app.controller';
import { ConsumerAppService } from './consumer-app.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConsumerAppController],
  providers: [ConsumerAppService],
})
export class ConsumerAppModule {}
