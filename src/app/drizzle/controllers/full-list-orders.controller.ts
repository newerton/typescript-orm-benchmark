import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { ZodValidationPipe } from '@app/@common/application/pipes';

import { FilterOrdersDrizzleDto, FullListOrdersDrizzleOutputDto } from '../dto';
import { FullListOrdersUseCase } from '../use-cases';
import { OrdersQueryFilterSchemaValidation } from '../validations';

@Controller('drizzle')
@ApiTags('Drizzle')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class FullListOrdersController {
  constructor(private readonly useCase: FullListOrdersUseCase) {}

  @Get('full')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all orders',
    description: 'List all orders',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FullListOrdersDrizzleOutputDto,
    description: 'List of orders and count',
  })
  async execute(
    @Query(
      'filter',
      new ZodValidationPipe(new OrdersQueryFilterSchemaValidation()),
    )
    filter: FilterOrdersDrizzleDto,
  ): Promise<FullListOrdersDrizzleOutputDto[]> {
    return this.useCase.execute(filter);
  }
}
