import { ApiProperty } from '@nestjs/swagger';

export class FilterOrdersDto {
  @ApiProperty({
    type: 'string',
    name: 'filter[user]',
    description: 'User',
    required: false,
  })
  user?: string;
}
