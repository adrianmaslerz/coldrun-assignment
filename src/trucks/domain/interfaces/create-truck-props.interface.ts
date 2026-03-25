import { TruckStatus } from '../enums/truck-status.enum';

export interface CreateTruckProps {
  code: string;
  name: string;
  status?: TruckStatus;
  description?: string;
}
