import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTruckCommand } from './create-truck.command';
import { TruckRepository } from '../../domain/repositories/truck.repository';
import { TruckDomainService } from '../../domain/services/truck-domain.service';
import { TruckProps } from '../../domain/interfaces/truck-props.interface';
import { Truck } from '../../domain/aggregates/truck.aggregate';

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
