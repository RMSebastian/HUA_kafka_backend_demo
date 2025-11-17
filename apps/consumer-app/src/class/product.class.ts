import { IsNumber, IsString } from 'class-validator';
import { Type, Expose } from 'class-transformer';

export class Product {
  @Expose()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  description: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  price: number;
}
