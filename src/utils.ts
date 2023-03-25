import { BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';

const zodError = (error: ZodError) => {
  const errors = error.errors.map((err) => {
    return {
      field: err.path[0],
      message: err.message,
    };
  });

  throw new BadRequestException(errors);
};

export {
    zodError,
}
