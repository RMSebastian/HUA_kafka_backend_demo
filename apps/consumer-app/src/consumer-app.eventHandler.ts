import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { CreateProductDto } from './dto/product.dto';
import { ConsumerAppService } from './consumer-app.service';
import { Controller, UseFilters } from '@nestjs/common';
import { KafkaMaxRetryExceptionFilter } from './filters/kafka.retryException';
import { commitOffset } from './utils/kafka.commitOffset';

@UseFilters(new KafkaMaxRetryExceptionFilter(5))
@Controller()
export class ConsumerAppEventHandler {
  constructor(private readonly consumerAppService: ConsumerAppService) {}
  @EventPattern('product_created')
  async handleProductCreated(
    @Payload() data: CreateProductDto,
    @Ctx() context: KafkaContext,
  ) {
    try {
      await this.consumerAppService.createProduct(data);
      await commitOffset(context);
    } catch (error) {
      console.error('Error handling product_created event:', error);
    }
  }
}
