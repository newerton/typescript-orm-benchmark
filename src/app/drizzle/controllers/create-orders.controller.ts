import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { ZodValidationPipe } from '@app/@common/application/pipes';
import { OrdersRepositoryOutput } from '@core/orders/domain/port/repository';

import { CreateOrdersDrizzleInputDto } from '../dto';
import { CreateOrdersUseCase } from '../use-cases';
import { CreateOrdersSchemaValidation } from '../validations';

@Controller('drizzle')
@ApiTags('Drizzle')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class CreateOrdersController {
  constructor(private readonly useCase: CreateOrdersUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    description: 'Create order input',
    type: CreateOrdersDrizzleInputDto,
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Created' })
  async execute(
    @Body(new ZodValidationPipe(new CreateOrdersSchemaValidation()))
    body: CreateOrdersDrizzleInputDto,
  ): Promise<OrdersRepositoryOutput> {
    return this.useCase.execute(body);
  }
}
