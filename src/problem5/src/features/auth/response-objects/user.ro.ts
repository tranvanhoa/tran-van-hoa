import { ApiProperty } from '@nestjs/swagger';

export class UserRo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  token: string;
}

export class UserCreatedRo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
}
