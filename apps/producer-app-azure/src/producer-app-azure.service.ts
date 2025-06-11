import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';
import { Product } from 'apps/consumer-app/src/class/product.class';
import { CreateProductDto } from 'apps/consumer-app/src/dto/product.dto';
import { v4 } from 'uuid';

@Injectable()
export class ProducerAppAzureService implements OnModuleDestroy {
  private serviceBusClient: ServiceBusClient;
  private readonly uniqueId: string;
  constructor() {
    this.serviceBusClient = new ServiceBusClient(
      process.env.AZURE_SERVICE_BUS_CONNECTION_STRING!,
    );
    this.uniqueId = v4();
  }
  async onModuleDestroy() {
    await this.serviceBusClient.close();
  }
  async createProduct(newProd: CreateProductDto): Promise<Product> {
    const newId = new Date().getTime();
    const newProduct: Product = {
      ...newProd,
      id: newId,
    };
    const sender = this.serviceBusClient.createSender('sb-poc_queue');
    await sender.sendMessages({
      body: newProduct,
    });
    console.log('✅ Mensaje Enviado:', newProduct);
    await sender.close();

    return newProduct;
  }
}
