import { HttpStatus } from '@nestjs/common';
import { DomainException } from './domain.exception';

export class DuplicateTruckCodeException extends DomainException {
  constructor(code: string) {
    super(
      `Truck with code "${code}" already exists`,
      'DUPLICATE_TRUCK_CODE',
      HttpStatus.CONFLICT,
    );
  }
}
