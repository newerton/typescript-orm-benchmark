import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdersTypeOrmInputDto {
  @ApiProperty({ type: 'string' })
  user?: string;
}

export class UpdateOrdersTypeOrmOutputDto {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string' })
  user: string;

  @ApiProperty({ type: 'string' })
  created_at: Date;
}
