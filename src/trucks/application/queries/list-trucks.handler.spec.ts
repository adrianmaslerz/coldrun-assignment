import { ListTrucksHandler } from './list-trucks.handler';
import { ListTrucksQuery } from './list-trucks.query';
import { TruckRepository } from '../../domain/repositories/truck.repository';
import { TruckStatus } from '../../domain/enums/truck-status.enum';

describe('ListTrucksHandler', () => {
  let handler: ListTrucksHandler;
  let findAll: jest.Mock;

  beforeEach(() => {
    findAll = jest.fn().mockResolvedValue([]);
    const repo = { findAll } as unknown as TruckRepository;
    handler = new ListTrucksHandler(repo);
  });

  it('calls findAll with filter and sort from query', async () => {
    const query = new ListTrucksQuery(
      TruckStatus.LOADING,
      'TRUCK001',
      'Volvo',
      'name',
      'asc',
    );

    await handler.execute(query);

    expect(findAll).toHaveBeenCalledWith(
      { status: TruckStatus.LOADING, code: 'TRUCK001', name: 'Volvo' },
      { sortBy: 'name', order: 'asc' },
    );
  });
});
