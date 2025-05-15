import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { ConsumerAppService } from './consumer-app.service';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { commitOffset } from './utils/kafka.commitOffset';
import { KafkaMaxRetryExceptionFilter } from './filters/kafka.retryException';
import { handleKafkaRetries } from './filters/kafka.retry';
import { Product } from './class/product.class';
import { KafkaTransaction } from '../decorators/kafka.decorators';
import newrelic from 'newrelic';
@Controller()
export class ConsumerAppEventHandler {
  constructor(
    private readonly consumerAppService: ConsumerAppService,
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  private async processProductCreated(data: Product, context: KafkaContext) {
    try {
      if (
        (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') &&
        data.name === 'fail'
      ) {
        throw new TypeError('Algo salio mal con kafka');
      }
      const product = this.consumerAppService.getProduct(data.id);
      if (product) {
        await commitOffset(context);
        return;
      }

      await commitOffset(context);
      await this.consumerAppService.createProduct(data);
    } catch (error) {
      switch (error.name) {
        case 'TypeError':
          await handleKafkaRetries(
            this.kafkaService,
            context,
            'product_created',
            'Simulated error for testing',
          );
          break;
        default:
          console.error('Error handling product_created event:', error);
      }
    }
  }

//   private handle (kafkaContext: KafkaContext,callback: () => void){
//     const topic = kafkaContext?.getTopic?.() || 'unknown-topic';
//     const partition = kafkaContext?.getPartition?.();
//     const offset = kafkaContext?.getMessage()?.offset;
//     const key = kafkaContext?.getMessage()?.key?.toString();

//     return newrelic.startBackgroundTransaction(`Kafka/${topic}`, async () => {
//       const tx = newrelic.getTransaction();

//       try {
//         newrelic.addCustomAttributes({
//           topic,
//           partition,
//           offset,
//           key,
//         });

//         const result = await original.apply(this, args);
//         tx.end();
//         return result;
//       } catch (err) {
//         newrelic.noticeError(err);
//         tx.end();
//         throw err;
//       }
// } 
  // @KafkaTransaction('product_created')
  @EventPattern('product_created')
  async handleProductCreated(
    @Payload() data: Product,
    @Ctx() context: KafkaContext,
  ) {
    await this.processProductCreated(data, context);
  }
  // @KafkaTransaction('product_created_retry')
  @EventPattern('product_created_retry')
  async handleProductCreatedRetry(
    @Payload() data: Product,
    @Ctx() context: KafkaContext,
  ) {
    await this.processProductCreated(data, context);
  }
  // @KafkaTransaction('product_created_dlq')
  @EventPattern('product_created_dlq')
  async handleProductDlq(@Payload() data: any, @Ctx() context: KafkaContext) {
    await this.consumerAppService.saveDql(data);
    await commitOffset(context);
  }
}
