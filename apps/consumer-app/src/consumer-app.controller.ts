import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ConsumerAppService } from './consumer-app.service';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { Product } from './class/product.class';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { KafkaMaxRetryExceptionFilter } from './filters/kafka.retryException';
@UseFilters(new KafkaMaxRetryExceptionFilter(5))
@Controller()
export class ConsumerAppController {
  constructor(private readonly consumerAppService: ConsumerAppService) {}

  @Get('allProducts')
  getAllProducts(): Product[] {
    return this.consumerAppService.getAllProducts();
  }
  @Get('getProduct/:id')
  getProduct(@Param('id', ParseIntPipe) id: number): Product {
    return this.consumerAppService.getProduct(id);
  }

  @Put('updateProduct/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDto,
  ): Product {
    return this.consumerAppService.updateProduct(id, updateProduct);
  }

  @Post('createProduct')
  postProduct(@Body() createProductDto: CreateProductDto): Product {
    return this.consumerAppService.createProduct(createProductDto);
  }

  @Delete('deleteProduct/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number): Product {
    return this.consumerAppService.deleteProduct(id);
  }

  @EventPattern('product_created')
  async handleProductCreated(
    @Payload() data: CreateProductDto,
    @Ctx() context: KafkaContext,
  ) {
    try {
      await this.consumerAppService.createProduct(data);

      const originalMessage = context.getMessage();
      const consumerRef = context.getConsumer();
      const topic = context.getTopic();
      const partition = context.getPartition();
      const offset = (Number(originalMessage.offset) + 1).toString();

      await consumerRef.commitOffsets([{ topic, partition, offset }]);
    } catch (error) {
      // aquí puedes hacer un retry o manejar error
    }
  }
}
