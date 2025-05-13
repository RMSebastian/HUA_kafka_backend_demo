import { Controller, Get } from '@nestjs/common';
import { ConsumerAppService } from './consumer-app.service';
import { Product } from './class/product.class';
@Controller()
export class ConsumerAppController {
  constructor(private readonly consumerAppService: ConsumerAppService) {}

  @Get('allProducts')
  getAllProducts(): Product[] {
    return this.consumerAppService.getAllProducts();
  }
  @Get('Dlq')
  getDlq(): any {
    return this.consumerAppService.getDql();
  }
}
