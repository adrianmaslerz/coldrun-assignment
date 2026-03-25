import { TruckStatus } from '../enums/truck-status.enum';

export interface ListTrucksFilter {
  status?: TruckStatus;
  code?: string;
  name?: string;
}
