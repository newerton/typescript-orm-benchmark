import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdersInputDto {
  @ApiProperty({ type: 'string' })
  user?: string;
}

export class UpdateOrdersOutputDto {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string' })
  user: string;

  @ApiProperty({ type: 'string' })
  created_at: Date;
}
