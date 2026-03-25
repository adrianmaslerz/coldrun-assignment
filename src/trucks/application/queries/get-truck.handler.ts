import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTruckQuery } from './get-truck.query';
import { TruckRepository } from '../../domain/repositories/truck.repository';
import { TruckProps } from '../../domain/interfaces/truck-props.interface';
import { TruckNotFoundException } from '../../domain/exceptions';

@QueryHandler(GetTruckQuery)
export class GetTruckHandler implements IQueryHandler<GetTruckQuery> {
  constructor(private readonly truckRepository: TruckRepository) {}

  async execute(query: GetTruckQuery): Promise<TruckProps> {
    const truck = await this.truckRepository.findById(query.id);
    if (!truck) {
      throw new TruckNotFoundException(query.id);
    }
    return truck.toProps();
  }
}
