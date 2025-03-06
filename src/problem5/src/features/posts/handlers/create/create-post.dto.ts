import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description: string;
}
