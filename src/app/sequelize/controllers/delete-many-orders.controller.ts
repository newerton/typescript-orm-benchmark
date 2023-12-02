import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { ZodValidationPipe } from '@app/@common/application/pipes';

import { FilterOrdersDto } from '../dto';
import { DeleteManyOrdersUseCase } from '../use-cases';
import { OrdersQueryFilterSchemaValidation } from '../validations';

@Controller('sequelize')
@ApiTags('Sequelize')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class DeleteManyOrdersController {
  constructor(private readonly useCase: DeleteManyOrdersUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete many orders',
    description: 'Delete many orders',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'No Content' })
  async execute(
    @Query(
      'filter',
      new ZodValidationPipe(new OrdersQueryFilterSchemaValidation()),
    )
    filter: FilterOrdersDto,
  ): Promise<void> {
    return this.useCase.execute(filter);
  }
}
