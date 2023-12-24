import { ApiProperty } from '@nestjs/swagger';

export class CreateOrdersPrismaInputDto {
  @ApiProperty({ type: 'string', example: 'Joe Doe' })
  user: string;

  @ApiProperty({
    type: 'array',
    example: [
      {
        name: 'Item 1',
        value: 10,
      },
    ],
  })
  items: Array<{ name: string; value: number }>;
}
