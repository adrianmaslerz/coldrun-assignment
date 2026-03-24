import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTruckCommand } from './delete-truck.command.js';
import { TruckRepository } from '../ports/truck.repository.js';
import { TruckNotFoundException } from '../../domain/exceptions';

@CommandHandler(DeleteTruckCommand)
export class DeleteTruckHandler implements ICommandHandler<DeleteTruckCommand> {
  constructor(private readonly truckRepository: TruckRepository) {}

  async execute(command: DeleteTruckCommand): Promise<void> {
    const truck = await this.truckRepository.findById(command.id);
    if (!truck) {
      throw new TruckNotFoundException(command.id);
    }

    await this.truckRepository.delete(command.id);
  }
}
