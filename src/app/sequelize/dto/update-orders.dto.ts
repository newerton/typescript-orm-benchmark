import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdersSequelizeInputDto {
  @ApiProperty({ type: 'string' })
  user?: string;
}

export class UpdateOrdersSequelizeOutputDto {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string' })
  user: string;

  @ApiProperty({ type: 'string' })
  created_at: Date;
}
