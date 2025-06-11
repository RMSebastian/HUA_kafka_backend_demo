import { Module } from '@nestjs/common';
import { ProducerAppAzureController } from './producer-app-azure.controller';
import { ProducerAppAzureService } from './producer-app-azure.service';
import { AzureServiceBusModule } from '@niur/nestjs-service-bus';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ProducerAppAzureController],
  providers: [ProducerAppAzureService],
})
export class ProducerAppAzureModule {}
