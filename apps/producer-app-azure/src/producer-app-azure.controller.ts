import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProducerAppAzureService } from './producer-app-azure.service';
import { CreateProductDto } from 'apps/consumer-app/src/dto/product.dto';

@Controller('producer')
export class ProducerAppAzureController {
  constructor(private readonly service: ProducerAppAzureService) {}

  @Post()
  async send(@Body() createProductDto: CreateProductDto) {
    await this.service.createProduct(createProductDto);
    return { status: 'Mensaje enviado', createProductDto };
  }
}
