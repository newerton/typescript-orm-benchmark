import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';

import { DeleteOrdersUseCase } from '../use-cases';

@Controller('prisma')
@ApiTags('Prisma')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class DeleteOrdersController {
  constructor(private readonly useCase: DeleteOrdersUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a order',
    description: 'Delete a order',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'No Content' })
  async execute(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.useCase.execute(id);
  }
}
