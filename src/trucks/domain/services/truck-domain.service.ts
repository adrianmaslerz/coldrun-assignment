import { Injectable } from '@nestjs/common';
import { TruckRepository } from '../repositories/truck.repository';
import { DuplicateTruckCodeException } from '../exceptions';

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
