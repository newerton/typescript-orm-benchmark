import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { ApiServerConfig } from '@core/@shared/infrastructure/config/env';

@Controller()
@ApiTags('healthcheck')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class MainController {
  @Get('healthcheck')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Healthcheck', description: 'Healthcheck' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  execute(): { status: string } {
    return {
      status: `[${ApiServerConfig.ENV}] orm-benchmark está online`,
    };
  }
}
