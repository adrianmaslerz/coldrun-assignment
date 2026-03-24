import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListTrucksQuery } from './list-trucks.query.js';
import { TruckProps } from '../../domain/truck.aggregate.js';
import { TruckRepository } from '../ports/truck.repository.js';

@QueryHandler(ListTrucksQuery)
export class ListTrucksHandler implements IQueryHandler<ListTrucksQuery> {
  constructor(private readonly truckRepository: TruckRepository) {}

  async execute(query: ListTrucksQuery): Promise<TruckProps[]> {
    const trucks = await this.truckRepository.findAll(
      {
        status: query.status,
        code: query.code,
        name: query.name,
      },
      {
        sortBy: query.sortBy,
        order: query.order,
      },
    );

    return trucks.map((truck) => truck.toProps());
  }
}
