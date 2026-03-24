import { TruckStatus } from '../../domain/truck-status.enum.js';
import { TruckProps } from '../../domain/truck.aggregate.js';

export class ListTrucksQuery {
  constructor(
    public readonly status?: TruckStatus,
    public readonly code?: string,
    public readonly name?: string,
    public readonly sortBy?: keyof TruckProps,
    public readonly order?: 'asc' | 'desc',
  ) {}
}
