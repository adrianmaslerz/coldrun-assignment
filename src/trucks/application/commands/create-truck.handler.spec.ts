import { CreateTruckHandler } from './create-truck.handler';
import { CreateTruckCommand } from './create-truck.command';
import { TruckRepository } from '../../domain/repositories/truck.repository';
import { TruckDomainService } from '../../domain/services/truck-domain.service';
import { TruckStatus } from '../../domain/enums/truck-status.enum';

describe('CreateTruckHandler', () => {
  let handler: CreateTruckHandler;
  let save: jest.Mock;
  let assertCodeUnique: jest.Mock;

  beforeEach(() => {
    save = jest.fn();
    assertCodeUnique = jest.fn();
    const repo = { save } as unknown as TruckRepository;
    const domainService = { assertCodeUnique } as unknown as TruckDomainService;
    handler = new CreateTruckHandler(repo, domainService);
  });

  it('asserts code uniqueness before saving', async () => {
    const command = new CreateTruckCommand(
      'TRUCK001',
      'Volvo FH16',
      TruckStatus.OUT_OF_SERVICE,
      'desc',
    );

    await handler.execute(command);

    expect(assertCodeUnique).toHaveBeenCalledWith('TRUCK001');
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('does not save when assertCodeUnique throws', async () => {
    assertCodeUnique.mockRejectedValue(new Error('duplicate'));
    const command = new CreateTruckCommand(
      'TRUCK001',
      'Volvo',
      TruckStatus.OUT_OF_SERVICE,
    );

    await expect(handler.execute(command)).rejects.toThrow('duplicate');
    expect(save).not.toHaveBeenCalled();
  });
});
