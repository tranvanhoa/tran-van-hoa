import { ApiProperty } from '@nestjs/swagger';

export class PostRo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  slug: string;
  @ApiProperty()
  isPublished: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
