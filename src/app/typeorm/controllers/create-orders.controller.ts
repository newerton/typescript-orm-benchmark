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

import { CreateOrdersInputDto } from '../dto';
import { CreateOrdersUseCase } from '../use-cases';
import { CreateOrdersSchemaValidation } from '../validations';

@Controller('typeorm')
@ApiTags('TypeOrm')
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
    type: CreateOrdersInputDto,
    description: 'Create order input',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Created' })
  async execute(
    @Body(new ZodValidationPipe(new CreateOrdersSchemaValidation()))
    body: CreateOrdersInputDto,
  ): Promise<OrdersRepositoryOutput> {
    return this.useCase.execute(body);
  }
}
