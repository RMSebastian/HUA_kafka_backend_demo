import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Product } from './class/product.class';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CustomLoggerService } from 'apps/consumer-app/src/logs/log.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private logger: CustomLoggerService,
  ) {}

  @Get('allProducts')
  getAllProducts(): Product[] {
    return this.appService.getAllProducts();
  }
  @Post('createProduct')
  async postProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.appService.createProduct(createProductDto);
      return product;
    } catch (error) {
      this.logger.error(`Error creating product: ${error}`);
      console.error('Error creating product:', error);
      throw new InternalServerErrorException('Could not create product');
    }
  }
}
