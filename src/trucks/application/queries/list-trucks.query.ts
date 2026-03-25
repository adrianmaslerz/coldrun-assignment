import { TruckStatus } from '../../domain/enums/truck-status.enum';
import { TruckProps } from '../../domain/interfaces/truck-props.interface';

export class ListTrucksQuery {
  constructor(
    public readonly status?: TruckStatus,
    public readonly code?: string,
    public readonly name?: string,
    public readonly sortBy?: keyof TruckProps,
    public readonly order?: 'asc' | 'desc',
  ) {}
}
