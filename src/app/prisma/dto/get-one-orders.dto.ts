import { randomUUID } from 'crypto';

import { ApiProperty } from '@nestjs/swagger';

export class GetOneOrdersPrismaOutputDto {
  @ApiProperty({ type: 'string', example: randomUUID() })
  id: string;

  @ApiProperty({ type: 'string', example: 'Joe Doe' })
  user: string;

  @ApiProperty({ type: 'string', example: new Date().toISOString() })
  created_at: Date;
}
