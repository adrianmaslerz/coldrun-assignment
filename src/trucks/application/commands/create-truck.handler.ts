import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTruckCommand } from './create-truck.command.js';
import { Truck, TruckProps } from '../../domain/truck.aggregate.js';
import { TruckRepository } from '../ports/truck.repository.js';
import { TruckDomainService } from '../../domain/truck-domain.service.js';

@CommandHandler(CreateTruckCommand)
export class CreateTruckHandler implements ICommandHandler<CreateTruckCommand> {
  constructor(
    private readonly truckRepository: TruckRepository,
    private readonly truckDomainService: TruckDomainService,
  ) {}

  async execute(command: CreateTruckCommand): Promise<TruckProps> {
    await this.truckDomainService.assertCodeUnique(command.code);

    const truck = Truck.create({
      code: command.code,
      name: command.name,
      status: command.status,
      description: command.description,
    });

    await this.truckRepository.save(truck);

    return truck.toProps();
  }
}
