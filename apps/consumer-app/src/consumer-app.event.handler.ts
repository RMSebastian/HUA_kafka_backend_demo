import { ConsumerAppService } from './consumer-app.service';
import { Controller } from '@nestjs/common';
import { Product } from './class/product.class';
import { EachMessagePayload } from 'kafkajs';
import { KafkaTopic } from '../decorators/kafka.decorators';
import { NewRelicTransaction } from '../decorators/newrelic.decorators';

@Controller()
export class ConsumerAppEventHandler {
  constructor(private readonly consumerAppService: ConsumerAppService) {}

  @KafkaTopic<Product>('test-topic', Product)
  @NewRelicTransaction<Product>()
  async HandleProductCreated(data: Product, ctx: EachMessagePayload) {
    return this.handleProductCreated(data, ctx);
  }
  @KafkaTopic<Product>('test-topic-retry', Product)
  @NewRelicTransaction<Product>()
  async HandleProductCreatedRetry(data: Product, ctx: EachMessagePayload) {
    return this.handleProductCreated(data, ctx);
  }

  @KafkaTopic('test-topic-dlq')
  @NewRelicTransaction<Object>()
  async HandleDLQCreated(data: Object, ctx: EachMessagePayload) {
    try {
      await this.consumerAppService.saveDql(data);

      console.log(
        `Product DLQ with id ${JSON.stringify(data)} created successfully.`,
      );
    } catch (error) {
      throw error;
    }
  }

  private async handleProductCreated(data: Product, ctx: EachMessagePayload) {
    try {
      if (
        (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') &&
        data.name === 'fail'
      )
        throw new TypeError(
          JSON.stringify({
            topic: 'test-topic',
            message: 'Simulated TypeError for testing retries',
          }),
        );

      const product = this.consumerAppService.getProduct(data.id);

      if (product) {
        console.log(
          `Product with id ${data.id} already exists. Skipping creation.`,
        );
        return;
      }
      await this.consumerAppService.createProduct(data);

      console.log(
        `Product with id ${JSON.stringify(data)} created successfully.`,
      );
    } catch (error) {
      throw error;
    }
  }
}
