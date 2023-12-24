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

import { FilterOrdersTypeOrmDto, FullListOrdersTypeOrmOutputDto } from '../dto';
import { FullListOrdersUseCase } from '../use-cases';
import { OrdersQueryFilterSchemaValidation } from '../validations';

@Controller('typeorm')
@ApiTags('TypeOrm')
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
    type: FullListOrdersTypeOrmOutputDto,
    description: 'List of orders and count',
  })
  async execute(
    @Query(
      'filter',
      new ZodValidationPipe(new OrdersQueryFilterSchemaValidation()),
    )
    filter: FilterOrdersTypeOrmDto,
  ): Promise<FullListOrdersTypeOrmOutputDto[]> {
    return this.useCase.execute(filter);
  }
}
