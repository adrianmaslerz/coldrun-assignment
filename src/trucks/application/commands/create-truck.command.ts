import { TruckStatus } from '../../domain/enums/truck-status.enum';

export class CreateTruckCommand {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly status?: TruckStatus,
    public readonly description?: string,
  ) {}
}
