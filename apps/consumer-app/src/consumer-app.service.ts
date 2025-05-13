import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './class/product.class';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
@Injectable()
export class ConsumerAppService {
  private readonly products: Product[] = [];
  private dlq: any;
  constructor() {}

  getProduct(id: number): Product | null {
    const product: Product | undefined = this.products.find(
      (product) => product.id === id,
    );
    if (!product) {
      return null;
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
  createProduct(newProd: Product): Product {
    this.products.push(newProd);
    return newProd;
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
  getDql(): any {
    return this.dlq ?? null;
  }

  saveDql(data: any): any {
    this.dlq = data;
  }
}
