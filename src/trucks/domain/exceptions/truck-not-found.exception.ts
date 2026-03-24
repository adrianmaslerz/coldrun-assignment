import { HttpStatus } from '@nestjs/common';
import { DomainException } from './domain.exception.js';

export class TruckNotFoundException extends DomainException {
  constructor(id: string) {
    super(
      `Truck with id "${id}" not found`,
      'TRUCK_NOT_FOUND',
      HttpStatus.NOT_FOUND,
    );
  }
}
