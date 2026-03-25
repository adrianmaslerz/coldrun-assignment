import { HttpStatus } from '@nestjs/common';

import { DomainException } from './domain.exception';
import { TruckStatus } from '../enums/truck-status.enum';

export class InvalidStatusTransitionException extends DomainException {
  constructor(from: TruckStatus, to: TruckStatus) {
    super(
      `Cannot transition truck status from "${from}" to "${to}"`,
      'INVALID_STATUS_TRANSITION',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
