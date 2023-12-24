import { ApiProperty } from '@nestjs/swagger';

export class FilterOrdersSequelizeDto {
  @ApiProperty({
    type: 'string',
    name: 'filter[user]',
    description: 'User',
    required: false,
  })
  user?: string;
}
