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
        await handleKafkaRetries(
          this.kafkaService,
          context,
          'product_created',
          'Simulated error for testing',
        );
      }
      const product = this.consumerAppService.getProduct(data.id);
      if (product) {
        await commitOffset(context);
        return;
      }

      await this.consumerAppService.createProduct(data);
      await commitOffset(context);
    } catch (error) {
      console.error('Error handling product_created event:', error);
    }
  }
  @EventPattern('product_created')
  async handleProductCreated(
    @Payload() data: Product,
    @Ctx() context: KafkaContext,
  ) {
    await this.processProductCreated(data, context);
  }
  @EventPattern('product_created_retry')
  async handleProductCreatedRetry(
    @Payload() data: Product,
    @Ctx() context: KafkaContext,
  ) {
    await this.processProductCreated(data, context);
  }

  @EventPattern('product_created_dlq')
  async handleProductDlq(@Payload() data: any, @Ctx() context: KafkaContext) {
    await this.consumerAppService.saveDql(data);
    await commitOffset(context);
  }
}
