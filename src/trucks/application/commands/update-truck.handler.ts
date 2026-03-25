import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTruckCommand } from './update-truck.command';
import { TruckRepository } from '../../domain/repositories/truck.repository';
import { TruckDomainService } from '../../domain/services/truck-domain.service';
import { TruckProps } from '../../domain/interfaces/truck-props.interface';
import { TruckNotFoundException } from '../../domain/exceptions';

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
