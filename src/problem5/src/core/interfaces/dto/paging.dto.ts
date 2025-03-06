import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class PagingDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Page number',
    required: false,
    default: 1,
  })
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @Type(() => Number)
  limit: number = 10;
}
