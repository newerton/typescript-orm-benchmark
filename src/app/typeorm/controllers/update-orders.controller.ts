import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { UUIDSchemaValidation } from '@app/@common/application/validations';

import { UpdateOrdersTypeOrmInputDto } from '../dto';
import { UpdateOrdersUseCase } from '../use-cases';
import { UpdateOrdersSchemaValidation } from '../validations';

@Controller('typeorm')
@ApiTags('TypeOrm')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class UpdateOrdersController {
  constructor(private readonly useCase: UpdateOrdersUseCase) {}

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Update a order',
    description: 'Update a order',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No Content' })
  async execute(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
    @Body(new ZodValidationPipe(new UpdateOrdersSchemaValidation()))
    body: UpdateOrdersTypeOrmInputDto,
  ): Promise<void> {
    await this.useCase.execute(id, body);
  }
}
