import { Module } from '@nestjs/common';
import { ConsumerAppAzureController } from './consumer-app-azure.controller';
import { ConsumerAppAzureService } from './consumer-app-azure.service';
import { ConfigModule } from '@nestjs/config';
import { AzureServiceBusModule } from '@niur/nestjs-service-bus';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ConsumerAppAzureController],
  providers: [ConsumerAppAzureService],
})
export class ConsumerAppAzureModule {}
