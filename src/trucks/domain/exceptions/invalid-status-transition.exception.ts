import { HttpStatus } from '@nestjs/common';
import { TruckStatus } from '../truck-status.enum.js';
import { DomainException } from './domain.exception.js';

export class InvalidStatusTransitionException extends DomainException {
  constructor(from: TruckStatus, to: TruckStatus) {
    super(
      `Cannot transition truck status from "${from}" to "${to}"`,
      'INVALID_STATUS_TRANSITION',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
