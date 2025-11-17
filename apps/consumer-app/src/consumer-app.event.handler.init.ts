import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { ConsumerAppEventHandler } from './consumer-app.event.handler';
import {
  KAFKA_PAYLOAD_TYPE,
  KAFKA_TOPIC,
} from '../decorators/kafka.decorators';
import { validatePayload } from '@utils/class.validator';

@Injectable()
export class ConsummerAppEventHandlerInit {
  private topicHandlers: Record<
    string,
    {
      handler: Function;
      dto?: new () => any;
    }
  > = {};
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaService: Kafka,
    private readonly moduleRef: ModuleRef,
    private readonly reflector: Reflector,
  ) {
    console.log('ConsummerAppEventHandlerInit initialized');
  }

  async onModuleInit() {
    this.loadTopicHandlers();
    const consumer = this.kafkaService.consumer({ groupId: process.env.KAFKA_GROUP_ID ?? 'default-group' });
    await consumer.connect();

    Object.keys(this.topicHandlers).forEach(async (topic) => {
      await consumer.subscribe({ topic, fromBeginning: true });
    });
    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          const entry = this.topicHandlers[payload.topic];
          if (!entry) {
            console.error('No entry for the topic prepared:', payload.topic);
            return;
          }

          const { handler, dto } = entry;

          let data = payload.message.value
            ? (() => {
                try {
                  const raw = payload.message.value.toString();
                  const parsed = JSON.parse(raw);
                  return parsed;
                } catch (err) {
                  console.error(
                    '❌ Error al parsear payload.message.value:',
                    err,
                  );
                  return payload.message.value;
                }
              })()
            : null;

          if (dto) {
            data = await validatePayload(dto, data);
          }

          await this.handleTopic(data, payload, consumer, handler);
        } catch (err) {
          console.error(
            `❌ Error al procesar topic ${payload.topic}:`,
            err.message,
          );

          await this.handleRetryTopic(payload, err.message, payload.topic);
        }
      },
    });
  }

  private async handleTopic(
    data: any,
    payload: EachMessagePayload,
    consumer: Consumer,
    handler: Function,
  ) {
    try {
      await handler(data, payload);

      await consumer.commitOffsets([
        {
          topic: payload.topic,
          partition: payload.partition,
          offset: (BigInt(payload.message.offset) + 1n).toString(),
        },
      ]);
    } catch (error) {
      switch (error.name) {
        case 'TypeError':
          const { topic, message } = JSON.parse(error.message);

          await this.handleRetryTopic(payload, message, topic);
          break;
        default:
          console.error('Error handling product_created event:', error);
      }
    }
  }

  private async handleRetryTopic(
    payload: EachMessagePayload,
    errorMessage?: string,
    errorTopic?: string,
  ) {
    try {
      const headers = payload.message.headers || {};
      const retryCount = parseInt(headers['retryCount']?.toString() || '0', 10);

      const newHeaders = {
        timestamp: new Date().toISOString(),
        retryCount: Buffer.from((retryCount + 1).toString()),
      };
      const topic = errorTopic || payload.topic;

      const valueBody = payload.message.value
        ? JSON.parse(payload.message.value.toString())
        : {};

      const newValue = {
        ...valueBody,
        error: {
          topic: topic,
          message: errorMessage,
          action:
            retryCount >= Number(process.env.MAX_RETRY)
              ? 'Max amount of attempts were made in this request'
              : `Retrying... Attempt Nº${retryCount + 1} for topic ${topic} due to: ${errorMessage}`,
        },
      };

      const destinationTopic =
        retryCount >= Number(process.env.MAX_RETRY)
          ? `${topic}_dlq`
          : `${topic}_retry`;

      await this.kafkaService.producer().send({
        topic: destinationTopic,
        messages: [
          {
            key: Date.now().toString(),
            value: JSON.stringify(newValue),
            headers: newHeaders,
          },
        ],
      });
    } catch (err) {
      console.error('❌ Failed to enqueue retry message:', err);

      try {
        await this.kafkaService.producer().send({
          topic: `${payload.topic}_dlq`,
          messages: [
            {
              key: Date.now().toString(),
              value: payload.message.value?.toString() ?? '',
              headers: {
                timestamp: new Date().toISOString(),
                fatalError: Buffer.from('true'),
                errorMessage: Buffer.from(err?.message || 'unknown'),
              },
            },
          ],
        });

        console.error(`Original message routed to DLQ ${payload.topic}_dlq`);
      } catch (dlqErr) {
        console.error(
          'CRITICAL: Could NOT send to DLQ. Message fully lost:',
          dlqErr,
        );
      }
    }
  }

  private loadTopicHandlers(): void {
    const controller = this.moduleRef.get(ConsumerAppEventHandler, {
      strict: false,
    });

    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(controller),
    ).filter(
      (methods) =>
        typeof controller[methods] === 'function' && methods !== 'constructor',
    );
    methodNames.forEach((methodName) => {
      const handler = controller[methodName];
      const topic = this.reflector.get<string>(KAFKA_TOPIC, handler);
      const dto = this.reflector.get(KAFKA_PAYLOAD_TYPE, handler);
      console.log(
        `Mapping topic "${topic}" to method "${methodName}" with DTO:`,
        dto,
      );
      if (topic)
        this.topicHandlers[topic] = {
          handler: handler.bind(controller),
          dto: dto,
        };
    });
  }
}
