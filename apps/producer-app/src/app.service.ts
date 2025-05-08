import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Product } from 'global/class/product.class';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'global/dto/product.dto copy';
@Injectable()
export class AppService {
  private readonly products: Product[] = [];
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
  ) {
    this.products = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description of Product 2',
        price: 200,
      },
      {
        id: 3,
        name: 'Product 3',
        description: 'Description of Product 3',
        price: 300,
      },
    ];
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
  createProduct(newProd: CreateProductDto): Product {
    const newId = this.products.length + 1;
    const newProduct: Product = { ...newProd, id: newId };
    this.products.push(newProduct);
    console.log('New product created:', newProduct);
    this.kafkaService.emit('product_created', newProduct);
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
