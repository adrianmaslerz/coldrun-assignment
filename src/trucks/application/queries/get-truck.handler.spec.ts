import { GetTruckHandler } from './get-truck.handler';
import { GetTruckQuery } from './get-truck.query';
import { TruckRepository } from '../../domain/repositories/truck.repository';
import { TruckNotFoundException } from '../../domain/exceptions';
import { Truck } from '../../domain/aggregates/truck.aggregate';
import { TruckStatus } from '../../domain/enums/truck-status.enum';

const makeTruck = () =>
  Truck.fromProps({
    id: 'uuid-1',
    code: 'TRUCK001',
    name: 'Volvo FH16',
    status: TruckStatus.OUT_OF_SERVICE,
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

describe('GetTruckHandler', () => {
  let handler: GetTruckHandler;
  let findById: jest.Mock;

  beforeEach(() => {
    findById = jest.fn();
    const repo = { findById } as unknown as TruckRepository;
    handler = new GetTruckHandler(repo);
  });

  it('throws TruckNotFoundException when truck does not exist', async () => {
    findById.mockResolvedValue(null);

    await expect(handler.execute(new GetTruckQuery('uuid-1'))).rejects.toThrow(
      TruckNotFoundException,
    );
  });

  it('calls findById with query id', async () => {
    findById.mockResolvedValue(makeTruck());

    await handler.execute(new GetTruckQuery('uuid-1'));

    expect(findById).toHaveBeenCalledWith('uuid-1');
  });
});
