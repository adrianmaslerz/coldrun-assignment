import { Truck } from '../aggregates/truck.aggregate';
import { ListTrucksFilter } from '../interfaces/list-trucks-filter.interface';
import { ListTrucksSort } from '../interfaces/list-trucks-sort.interface';

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
