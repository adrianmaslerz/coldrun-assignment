import { TruckProps } from './truck-props.interface';

export interface ListTrucksSort {
  sortBy?: keyof TruckProps;
  order?: 'asc' | 'desc';
}
