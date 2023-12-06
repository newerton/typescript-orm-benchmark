import { ApiProperty } from '@nestjs/swagger';

export class CreateOrdersInputDto {
  @ApiProperty({ type: 'string', example: 'Joe Doe' })
  user: string;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  items: Array<{ name: string; value: number }>;
}
