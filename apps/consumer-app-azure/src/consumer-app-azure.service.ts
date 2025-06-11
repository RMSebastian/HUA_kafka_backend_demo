import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
} from '@nestjs/common';
import { ServiceBusClient, ServiceBusReceiver } from '@azure/service-bus';
import { Product } from 'apps/consumer-app/src/class/product.class';
import { CreateProductDto } from 'apps/consumer-app/src/dto/product.dto';

@Injectable()
export class ConsumerAppAzureService implements OnModuleInit, OnModuleDestroy {
  private client: ServiceBusClient;
  private receiver: ServiceBusReceiver;
  private readonly products: Product[] = [];
  private readonly dlq: any[] = [];

  async onModuleInit() {
    this.client = new ServiceBusClient(
      process.env.AZURE_SERVICE_BUS_CONNECTION_STRING!,
    );
    this.receiver = this.client.createReceiver('sb-poc_queue', {
      receiveMode: 'peekLock',
    });

    this.receiver.subscribe({
      processMessage: async (message) => {
        this.products.push(message.body);
        console.log('📩 Mensaje recibido:', message.body);
      },
      processError: async (err) => {
        console.error('❌ Error procesando mensaje:', err);
      },
    });

    console.log('🚀 Esperando mensajes desde poc...');
  }

  async onModuleDestroy() {
    await this.receiver.close();
    await this.client.close();
  }
  getAllProducts(): Product[] {
    return this.products;
  }
  deleteDlq(): string {
    this.dlq.length = 0;
    return 'DLQ Deleted';
  }

  deleteProduct(): string {
    this.products.length = 0;
    return 'Products Deleted';
  }
  getDql(): any[] {
    return this.dlq ?? null;
  }
}
