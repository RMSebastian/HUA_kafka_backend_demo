import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { CreateProductDto } from './dto/product.dto';
import { ConsumerAppService } from './consumer-app.service';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { KafkaMaxRetryExceptionFilter } from './filters/kafka.retryException';
import { commitOffset } from './utils/kafka.commitOffset';

@Controller()
@UseFilters(new KafkaMaxRetryExceptionFilter(5))
export class ConsumerAppEventHandler {
  constructor(private readonly consumerAppService: ConsumerAppService) {}

  @EventPattern('product_created')
  async handleProductCreated(
    @Payload() data: CreateProductDto,
    @Ctx() context: KafkaContext,
  ) {
    try {
      if (
        (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev') &&
        data.name === 'force-fail'
      ) {
        throw new Error('force failed connection');
      }
      console.log('Received product_created event:', data);
      await this.consumerAppService.createProduct(data);
      await commitOffset(context);
    } catch (error) {
      console.error('Error handling product_created event:', error);
    }
  }
}
