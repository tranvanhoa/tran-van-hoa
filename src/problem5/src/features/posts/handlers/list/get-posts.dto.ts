/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { PagingDto } from 'src/core/interfaces/dto/paging.dto';

export class GetPostsDto extends PagingDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'Search by title',
  })
  title?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Search by published state',
  })
  @Transform(({ obj, key }) => {
    const value = obj[key];
    if (typeof value === 'string') {
      return obj[key] === 'true';
    }

    return value;
  })
  @IsBoolean()
  isPublished?: boolean;
}
