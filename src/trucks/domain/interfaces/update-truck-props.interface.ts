import { TruckStatus } from '../enums/truck-status.enum';

export interface UpdateTruckProps {
  code?: string;
  name?: string;
  status?: TruckStatus;
  description?: string | null;
}
