import { Kafka } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

export const KafkaProvider = {
  provide: 'KAFKA_SERVICE',
  useFactory: async (configService: ConfigService) => {

    const kafka = new Kafka({
      clientId: configService.get('KAFKA_CLIENT_ID') ?? 'test-client',
      brokers: [configService.get('KAFKA_BROKER') ?? 'localhost:9094'],
      ssl: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
        maxVersion: 'TLSv1.2',
      },
      sasl:
        configService.get('KAFKA_AUTH_USERNAME') &&
        configService.get('KAFKA_AUTH_PASSWORD')
          ? {
              mechanism: 'scram-sha-512',
              username: configService.get('KAFKA_AUTH_USERNAME'),
              password: configService.get('KAFKA_AUTH_PASSWORD'),
            }
          : undefined,
      retry: {
        retries: 5,
        initialRetryTime: 300,
        maxRetryTime: 10000,
      },
    });

    return kafka;
  },
  inject: [ConfigService], 
};
