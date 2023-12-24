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

import { FilterOrdersPrismaDto, GetOneOrdersPrismaOutputDto } from '../dto';
import { GetOneOrdersUseCase } from '../use-cases';
import { OrdersQueryFilterSchemaValidation } from '../validations';

@Controller('prisma')
@ApiTags('Prisma')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class GetOneOrdersController {
  constructor(private readonly useCase: GetOneOrdersUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get one order',
    description: 'Get one order',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetOneOrdersPrismaOutputDto,
    description: 'Orders found',
  })
  async execute(
    @Query(
      'filter',
      new ZodValidationPipe(new OrdersQueryFilterSchemaValidation()),
    )
    filter: FilterOrdersPrismaDto,
  ): Promise<GetOneOrdersPrismaOutputDto> {
    return this.useCase.execute(filter);
  }
}
