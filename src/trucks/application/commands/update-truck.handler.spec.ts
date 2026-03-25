import { UpdateTruckHandler } from './update-truck.handler';
import { UpdateTruckCommand } from './update-truck.command';
import { TruckRepository } from '../../domain/repositories/truck.repository';
import { TruckDomainService } from '../../domain/services/truck-domain.service';
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

describe('UpdateTruckHandler', () => {
  let handler: UpdateTruckHandler;
  let findById: jest.Mock;
  let save: jest.Mock;
  let assertCodeUnique: jest.Mock;

  beforeEach(() => {
    findById = jest.fn();
    save = jest.fn();
    assertCodeUnique = jest.fn();
    const repo = { findById, save } as unknown as TruckRepository;
    const domainService = { assertCodeUnique } as unknown as TruckDomainService;
    handler = new UpdateTruckHandler(repo, domainService);
  });

  it('throws TruckNotFoundException when truck does not exist', async () => {
    findById.mockResolvedValue(null);

    await expect(
      handler.execute(new UpdateTruckCommand('uuid-1', undefined, 'New Name')),
    ).rejects.toThrow(TruckNotFoundException);
    expect(save).not.toHaveBeenCalled();
  });

  it('asserts code uniqueness when code changes', async () => {
    findById.mockResolvedValue(makeTruck());
    const command = new UpdateTruckCommand('uuid-1', 'NEWCODE');

    await handler.execute(command);

    expect(assertCodeUnique).toHaveBeenCalledWith('NEWCODE', 'uuid-1');
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('skips code uniqueness check when code unchanged', async () => {
    findById.mockResolvedValue(makeTruck());
    const command = new UpdateTruckCommand('uuid-1', 'TRUCK001');

    await handler.execute(command);

    expect(assertCodeUnique).not.toHaveBeenCalled();
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('skips code uniqueness check when code not provided', async () => {
    findById.mockResolvedValue(makeTruck());
    const command = new UpdateTruckCommand('uuid-1', undefined, 'New Name');

    await handler.execute(command);

    expect(assertCodeUnique).not.toHaveBeenCalled();
    expect(save).toHaveBeenCalledTimes(1);
  });
});
