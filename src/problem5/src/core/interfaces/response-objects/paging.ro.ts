import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PagingRo<T> {
  @ApiProperty()
  items: T[];
  @ApiProperty()
  total: number;
  @ApiProperty()
  @Type(() => Number)
  page: number;
  @ApiProperty()
  limit: number;
}
