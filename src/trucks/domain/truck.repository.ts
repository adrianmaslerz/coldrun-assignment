import { Truck, TruckProps } from './truck.aggregate';
import { TruckStatus } from './truck-status.enum';

export interface ListTrucksFilter {
  status?: TruckStatus;
  code?: string;
  name?: string;
}

export interface ListTrucksSort {
  sortBy?: keyof TruckProps;
  order?: 'asc' | 'desc';
}

export abstract class TruckRepository {
  abstract save(truck: Truck): Promise<void>;
  abstract findById(id: string): Promise<Truck | null>;
  abstract findByCode(code: string): Promise<Truck | null>;
  abstract findAll(
    filter?: ListTrucksFilter,
    sort?: ListTrucksSort,
  ): Promise<Truck[]>;
  abstract delete(id: string): Promise<void>;
}
