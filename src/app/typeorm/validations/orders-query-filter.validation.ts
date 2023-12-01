import { z } from 'zod';

import { CreateValidationSchema } from '@app/@common/application/validators/create-schema.interface';

export class OrdersQueryFilterSchemaValidation
  implements CreateValidationSchema
{
  createSchema(): z.Schema {
    return z
      .object({
        user: z
          .string({
            description: 'User',
            invalid_type_error: 'User must be a string',
          })
          .min(1, { message: 'User must be at least 1 character' })
          .optional(),
      })
      .optional();
  }
}
