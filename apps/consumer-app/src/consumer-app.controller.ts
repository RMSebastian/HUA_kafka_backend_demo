import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ConsumerAppService } from './consumer-app.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'global/dto/product.dto copy';

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
}
