import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdersDrizzleInputDto {
  @ApiProperty({ type: 'string' })
  user?: string;
}

export class UpdateOrdersDrizzleOutputDto {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string' })
  user: string;

  @ApiProperty({ type: 'string' })
  created_at: Date;
}
