import { HttpStatus } from '@nestjs/common';

export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly httpStatus: HttpStatus,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
