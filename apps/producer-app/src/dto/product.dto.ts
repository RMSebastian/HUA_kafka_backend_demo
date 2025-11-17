// update-product.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Nombre del producto' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Descripción del producto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Precio del producto' })
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class CreateProductDto {
  @ApiPropertyOptional({ description: 'Nombre del producto' })
  @IsString()
  name: string;
  @ApiPropertyOptional({ description: 'Descripción del producto' })
  @IsString()
  description: string;
  @ApiPropertyOptional({ description: 'Precio del producto' })
  @IsOptional()
  @IsNumber()
  price: number;
}
