import { Module } from '@nestjs/common';
import { ConsumerAppController } from './consumer-app.controller';
import { ConsumerAppService } from './consumer-app.service';
import { ConfigModule } from '@nestjs/config';
import { ConsumerAppEventHandler } from './consumer-app.eventHandler';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    ConfigModule.forRoot(),
    // ClientsModule.register([
    //   {
    //     name: 'KAFKA_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: process.env.KAFKA_CLIENT_ID ?? 'default-client',
    //         brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
    //       },
    //       consumer: {
    //         groupId: process.env.KAFKA_GROUP_ID ?? 'default-group',
    //       },
    //     },
    //   },
    // ]),
  ],
  controllers: [ConsumerAppController, ConsumerAppEventHandler],
  providers: [ConsumerAppService],
})
export class ConsumerAppModule {}
