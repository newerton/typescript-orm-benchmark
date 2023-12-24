import { ApiProperty } from '@nestjs/swagger';

export class FilterOrdersDrizzleDto {
  @ApiProperty({
    type: 'string',
    name: 'filter[user]',
    description: 'User',
    required: false,
  })
  user?: string;
}
