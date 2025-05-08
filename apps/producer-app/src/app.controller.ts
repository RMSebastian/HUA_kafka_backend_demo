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
  @Get('getProduct/:id')
  getProduct(@Param('id', ParseIntPipe) id: number): Product {
    return this.appService.getProduct(id);
  }
  @Put('updateProduct/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDto,
  ): Product {
    return this.appService.updateProduct(id, updateProduct);
  }

  @Post('createProduct')
  postProduct(@Body() createProductDto: CreateProductDto): Product {
    return this.appService.createProduct(createProductDto);
  }

  @Delete('deleteProduct/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number): Product {
    return this.appService.deleteProduct(id);
  }
}
