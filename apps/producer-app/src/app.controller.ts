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
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
      console.error('Error creating product:', error);
      throw new InternalServerErrorException('Could not create product');
    }
  }
}
