import { randomUUID } from 'crypto';

import { ApiProperty } from '@nestjs/swagger';

export class ListAllOrdersPrismaOutputDto {
  @ApiProperty({ type: 'string', example: randomUUID() })
  id: string;

  @ApiProperty({ type: 'string', example: 'Joe Doe' })
  user: string;

  @ApiProperty({ type: 'string', example: new Date().toISOString() })
  created_at: Date;
}

export class ListAllOrdersPagedOutputDto {
  @ApiProperty({ type: [ListAllOrdersPrismaOutputDto] })
  data: ListAllOrdersPrismaOutputDto[];

  @ApiProperty({ type: 'number', example: 100 })
  count: number;

  @ApiProperty({ type: 'number', example: 1 })
  page: number;

  @ApiProperty({ type: 'number', example: 20 })
  limit: number;
}
