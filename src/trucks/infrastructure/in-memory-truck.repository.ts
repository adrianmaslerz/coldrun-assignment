import { Injectable } from '@nestjs/common';
import { TruckRepository } from '../domain/repositories/truck.repository';
import { TruckProps } from '../domain/interfaces/truck-props.interface';
import { Truck } from '../domain/aggregates/truck.aggregate';
import { ListTrucksFilter } from '../domain/interfaces/list-trucks-filter.interface';
import { ListTrucksSort } from '../domain/interfaces/list-trucks-sort.interface';

@Injectable()
export class InMemoryTruckRepository extends TruckRepository {
  private readonly store = new Map<string, TruckProps>();

  save(truck: Truck): Promise<void> {
    this.store.set(truck.id, truck.toProps());
    return Promise.resolve();
  }

  findById(id: string): Promise<Truck | null> {
    const props = this.store.get(id);
    return Promise.resolve(props ? Truck.fromProps({ ...props }) : null);
  }

  findByCode(code: string): Promise<Truck | null> {
    for (const props of this.store.values()) {
      if (props.code === code) {
        return Promise.resolve(Truck.fromProps({ ...props }));
      }
    }
    return Promise.resolve(null);
  }

  findAll(filter?: ListTrucksFilter, sort?: ListTrucksSort): Promise<Truck[]> {
    let results = Array.from(this.store.values());

    if (filter?.status) {
      results = results.filter((t) => t.status === filter.status);
    }
    if (filter?.code) {
      results = results.filter((t) =>
        t.code.toLowerCase().includes(filter.code!.toLowerCase()),
      );
    }
    if (filter?.name) {
      results = results.filter((t) =>
        t.name.toLowerCase().includes(filter.name!.toLowerCase()),
      );
    }

    if (sort?.sortBy) {
      const direction = sort.order === 'desc' ? -1 : 1;
      results.sort((a, b) => {
        const aVal = a[sort.sortBy!];
        const bVal = b[sort.sortBy!];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return -1 * direction;
        if (aVal > bVal) return 1 * direction;
        return 0;
      });
    }

    return Promise.resolve(
      results.map((props) => Truck.fromProps({ ...props })),
    );
  }

  delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }
}
