import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TrucksController } from './trucks.controller';
import { CreateTruckCommand } from '../application/commands/create-truck.command';
import { UpdateTruckCommand } from '../application/commands/update-truck.command';
import { DeleteTruckCommand } from '../application/commands/delete-truck.command';
import { GetTruckQuery } from '../application/queries/get-truck.query';
import { ListTrucksQuery } from '../application/queries/list-trucks.query';
import { TruckStatus } from '../domain/enums/truck-status.enum';

describe('TrucksController', () => {
  let controller: TrucksController;
  let commandBusExecute: jest.Mock;
  let queryBusExecute: jest.Mock;

  beforeEach(async () => {
    commandBusExecute = jest.fn();
    queryBusExecute = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrucksController],
      providers: [
        { provide: CommandBus, useValue: { execute: commandBusExecute } },
        { provide: QueryBus, useValue: { execute: queryBusExecute } },
      ],
    }).compile();

    controller = module.get<TrucksController>(TrucksController);
  });

  it('create executes CreateTruckCommand', async () => {
    await controller.create({
      code: 'TRUCK001',
      name: 'Volvo FH16',
      status: TruckStatus.OUT_OF_SERVICE,
      description: 'desc',
    });

    expect(commandBusExecute).toHaveBeenCalledWith(
      new CreateTruckCommand(
        'TRUCK001',
        'Volvo FH16',
        TruckStatus.OUT_OF_SERVICE,
        'desc',
      ),
    );
  });

  it('findAll executes ListTrucksQuery', async () => {
    await controller.findAll({
      status: TruckStatus.LOADING,
      code: 'TRUCK001',
      name: 'Volvo',
      sortBy: 'name',
      order: 'asc',
    });

    expect(queryBusExecute).toHaveBeenCalledWith(
      new ListTrucksQuery(
        TruckStatus.LOADING,
        'TRUCK001',
        'Volvo',
        'name',
        'asc',
      ),
    );
  });

  it('findOne executes GetTruckQuery', async () => {
    await controller.findOne('uuid-1');

    expect(queryBusExecute).toHaveBeenCalledWith(new GetTruckQuery('uuid-1'));
  });

  it('update executes UpdateTruckCommand', async () => {
    await controller.update('uuid-1', {
      code: 'TRUCK999',
      name: 'New Name',
      status: TruckStatus.LOADING,
      description: 'desc',
    });

    expect(commandBusExecute).toHaveBeenCalledWith(
      new UpdateTruckCommand(
        'uuid-1',
        'TRUCK999',
        'New Name',
        TruckStatus.LOADING,
        'desc',
      ),
    );
  });

  it('remove executes DeleteTruckCommand', async () => {
    await controller.remove('uuid-1');

    expect(commandBusExecute).toHaveBeenCalledWith(
      new DeleteTruckCommand('uuid-1'),
    );
  });
});
