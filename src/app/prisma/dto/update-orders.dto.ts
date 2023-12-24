import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdersPrismaInputDto {
  @ApiProperty({ type: 'string' })
  user?: string;
}

export class UpdateOrdersPrismaOutputDto {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string' })
  user: string;

  @ApiProperty({ type: 'string' })
  created_at: Date;
}
