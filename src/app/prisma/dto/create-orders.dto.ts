import { ApiProperty } from '@nestjs/swagger';

export class CreateOrdersInputDto {
  @ApiProperty({ type: 'string', example: 'Joe Doe' })
  user: string;
}
