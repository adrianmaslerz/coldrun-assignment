import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTruckCommand } from './update-truck.command.js';
import { TruckProps } from '../../domain/truck.aggregate.js';
import { TruckRepository } from '../ports/truck.repository.js';
import { TruckDomainService } from '../../domain/truck-domain.service.js';
import { TruckNotFoundException } from '../../domain/exceptions/truck-not-found.exception.js';

@CommandHandler(UpdateTruckCommand)
export class UpdateTruckHandler implements ICommandHandler<UpdateTruckCommand> {
  constructor(
    private readonly truckRepository: TruckRepository,
    private readonly truckDomainService: TruckDomainService,
  ) {}

  async execute(command: UpdateTruckCommand): Promise<TruckProps> {
    const truck = await this.truckRepository.findById(command.id);
    if (!truck) {
      throw new TruckNotFoundException(command.id);
    }

    if (command.code !== undefined && command.code !== truck.code) {
      await this.truckDomainService.assertCodeUnique(command.code, truck.id);
    }

    truck.update({
      code: command.code,
      name: command.name,
      status: command.status,
      description: command.description,
    });

    await this.truckRepository.save(truck);

    return truck.toProps();
  }
}
