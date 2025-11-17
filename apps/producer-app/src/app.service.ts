import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { Product } from './class/product.class';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private readonly products: Product[] = [];
  private producer: Producer;

  constructor(@Inject('KAFKA_SERVICE') private readonly kafka: Kafka) {
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
    } catch (err) {}
  }

  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }

  getProduct(id: number): Product {
    const product: Product | undefined = this.products.find(
      (product) => product.id === id,
    );
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  updateProduct(id: number, newProd: UpdateProductDto): Product {
    const updatedProduct: Product | undefined = this.products.find(
      (product) => product.id === id,
    );
    if (updatedProduct) {
      updatedProduct.name = newProd.name ?? updatedProduct.name;
      updatedProduct.description =
        newProd.description ?? updatedProduct.description;
      updatedProduct.price = newProd.price ?? updatedProduct.price;
    } else {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return updatedProduct;
  }

  async createProduct(newProd: CreateProductDto): Promise<Product> {
    const newId = new Date().getTime();
    const newProduct: Product = { ...newProd, id: newId };
    this.products.push(newProduct);
    const messageKey = `${newId}`;
    await this.producer.send({
      topic: 'test-topic',
      messages: [{ key: messageKey, value: JSON.stringify(newProduct) }],
    });
    return newProduct;
  }

  deleteProduct(id: number): Product {
    const deletedProduct: Product | undefined = this.products.find(
      (product) => product.id === id,
    );
    if (deletedProduct) {
      this.products.splice(this.products.indexOf(deletedProduct), 1);
    } else {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return deletedProduct;
  }
}
