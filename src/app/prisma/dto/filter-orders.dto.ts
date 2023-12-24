import { ApiProperty } from '@nestjs/swagger';

export class FilterOrdersPrismaDto {
  @ApiProperty({
    type: 'string',
    name: 'filter[user]',
    description: 'User',
    required: false,
  })
  user?: string;
}
