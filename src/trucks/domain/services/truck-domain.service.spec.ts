import { TruckDomainService } from './truck-domain.service';
import { TruckRepository } from '../repositories/truck.repository';
import { DuplicateTruckCodeException } from '../exceptions';
import { Truck } from '../aggregates/truck.aggregate';
import { TruckStatus } from '../enums/truck-status.enum';

const makeTruck = (id: string) =>
  Truck.fromProps({
    id,
    code: 'TRUCK001',
    name: 'Volvo FH16',
    status: TruckStatus.OUT_OF_SERVICE,
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

describe('TruckDomainService', () => {
  let service: TruckDomainService;
  let findByCode: jest.Mock;

  beforeEach(() => {
    findByCode = jest.fn();
    const repo = { findByCode } as unknown as TruckRepository;
    service = new TruckDomainService(repo);
  });

  describe('assertCodeUnique', () => {
    it('does not throw when code is not taken', async () => {
      findByCode.mockResolvedValue(null);

      await expect(
        service.assertCodeUnique('TRUCK001'),
      ).resolves.toBeUndefined();
    });

    it('does not throw when code belongs to excluded id', async () => {
      findByCode.mockResolvedValue(makeTruck('uuid-1'));

      await expect(
        service.assertCodeUnique('TRUCK001', 'uuid-1'),
      ).resolves.toBeUndefined();
    });

    it('throws DuplicateTruckCodeException when code is taken by another truck', async () => {
      findByCode.mockResolvedValue(makeTruck('uuid-2'));

      await expect(
        service.assertCodeUnique('TRUCK001', 'uuid-1'),
      ).rejects.toThrow(DuplicateTruckCodeException);
    });

    it('throws DuplicateTruckCodeException when code is taken and no excludeId given', async () => {
      findByCode.mockResolvedValue(makeTruck('uuid-1'));

      await expect(service.assertCodeUnique('TRUCK001')).rejects.toThrow(
        DuplicateTruckCodeException,
      );
    });
  });
});
