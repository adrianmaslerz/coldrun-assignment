import { TruckStatus } from '../enums/truck-status.enum';

export interface TruckProps {
  id: string;
  code: string;
  name: string;
  status: TruckStatus;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
