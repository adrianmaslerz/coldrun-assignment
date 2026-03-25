import { DeleteTruckHandler } from './delete-truck.handler';
import { DeleteTruckCommand } from './delete-truck.command';
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

describe('DeleteTruckHandler', () => {
  let handler: DeleteTruckHandler;
  let findById: jest.Mock;
  let deleteFn: jest.Mock;

  beforeEach(() => {
    findById = jest.fn();
    deleteFn = jest.fn();
    const repo = { findById, delete: deleteFn } as unknown as TruckRepository;
    handler = new DeleteTruckHandler(repo);
  });

  it('throws TruckNotFoundException when truck does not exist', async () => {
    findById.mockResolvedValue(null);

    await expect(
      handler.execute(new DeleteTruckCommand('uuid-1')),
    ).rejects.toThrow(TruckNotFoundException);
    expect(deleteFn).not.toHaveBeenCalled();
  });

  it('deletes truck when it exists', async () => {
    findById.mockResolvedValue(makeTruck());

    await handler.execute(new DeleteTruckCommand('uuid-1'));

    expect(deleteFn).toHaveBeenCalledWith('uuid-1');
  });
});
