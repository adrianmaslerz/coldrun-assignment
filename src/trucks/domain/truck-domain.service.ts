import { Injectable } from '@nestjs/common';
import { TruckRepository } from './truck.repository.js';
import { DuplicateTruckCodeException } from './exceptions/duplicate-truck-code.exception.js';

@Injectable()
export class TruckDomainService {
  constructor(private readonly truckRepository: TruckRepository) {}

  async assertCodeUnique(code: string, excludeId?: string): Promise<void> {
    const existing = await this.truckRepository.findByCode(code);
    if (existing && existing.id !== excludeId) {
      throw new DuplicateTruckCodeException(code);
    }
  }
}
