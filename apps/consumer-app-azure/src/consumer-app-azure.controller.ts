import { Controller, Delete, Get } from '@nestjs/common';
import { Product } from 'apps/consumer-app/src/class/product.class';
import { ConsumerAppAzureService } from './consumer-app-azure.service';

@Controller('consumer')
export class ConsumerAppAzureController {
  constructor(private readonly consumerAppService: ConsumerAppAzureService) {}
  @Get('allProducts')
  getAllProducts(): Product[] {
    return this.consumerAppService.getAllProducts();
  }
  @Get('Dlq')
  getDlq(): any {
    return this.consumerAppService.getDql();
  }

  @Delete('deleteDlq')
  deleteDlq(): any {
    return this.consumerAppService.deleteDlq();
  }
  @Delete('deleteProducts')
  deleteProducts(): any {
    return this.consumerAppService.deleteProduct();
  }
}
