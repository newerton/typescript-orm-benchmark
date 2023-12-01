import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { ZodValidationPipe } from '@app/@common/application/pipes';

import { FilterOrdersDto, ListAllOrdersPagedOutputDto } from '../dto';
import { ListAllOrdersUseCase } from '../use-cases';
import { OrdersQueryFilterSchemaValidation } from '../validations';

@Controller('typeorm')
@ApiTags('TypeOrm')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class ListAllOrdersController {
  constructor(private readonly useCase: ListAllOrdersUseCase) {}

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all orders',
    description: 'List all orders',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ListAllOrdersPagedOutputDto,
    description: 'List of orders and count',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    example: 1,
    allowEmptyValue: false,
    description: 'Page number',
  })
  async execute(
    @Query(
      'filter',
      new ZodValidationPipe(new OrdersQueryFilterSchemaValidation()),
    )
    filter: FilterOrdersDto,
    @Query('page') page: number,
  ): Promise<ListAllOrdersPagedOutputDto> {
    return this.useCase.execute(filter, page);
  }
}
