import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTruckQuery } from './get-truck.query.js';
import { TruckProps } from '../../domain/truck.aggregate.js';
import { TruckRepository } from '../ports/truck.repository.js';
import { TruckNotFoundException } from '../../domain/exceptions/truck-not-found.exception.js';

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
