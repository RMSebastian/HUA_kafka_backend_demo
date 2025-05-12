import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Product } from './class/product.class';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class AppService {
  private readonly products: Product[] = [];
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

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
    const newId = this.products.length + 1;
    const newProduct: Product = { ...newProd, id: newId };
    this.products.push(newProduct);
    const headers = {
      transactionId: new Date().getTime().toString(),
      timestamp: new Date().toISOString(),
      retryCount: '2',
    };
    const messageKey = `${newId}`;
    await this.kafkaService.emit('product_created', {
      value: newProd,
      headers: headers,
      key: messageKey,
      partition: '0',
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
