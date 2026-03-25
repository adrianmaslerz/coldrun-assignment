import { TruckStatus } from '../../domain/enums/truck-status.enum';

export class UpdateTruckCommand {
  constructor(
    public readonly id: string,
    public readonly code?: string,
    public readonly name?: string,
    public readonly status?: TruckStatus,
    public readonly description?: string | null,
  ) {}
}
