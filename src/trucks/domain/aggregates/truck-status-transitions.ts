import { TruckStatus } from '../enums/truck-status.enum';

const { OUT_OF_SERVICE, LOADING, TO_JOB, AT_JOB, RETURNING } = TruckStatus;

export const ALLOWED_STATUS_TRANSITIONS = new Map<
  TruckStatus,
  Set<TruckStatus>
>([
  [OUT_OF_SERVICE, new Set([LOADING, TO_JOB, AT_JOB, RETURNING])],
  [LOADING, new Set([TO_JOB, OUT_OF_SERVICE])],
  [TO_JOB, new Set([AT_JOB, OUT_OF_SERVICE])],
  [AT_JOB, new Set([RETURNING, OUT_OF_SERVICE])],
  [RETURNING, new Set([LOADING, OUT_OF_SERVICE])],
]);

export function isStatusTransitionAllowed(
  from: TruckStatus,
  to: TruckStatus,
): boolean {
  if (from === to) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS.get(from);
  return allowed?.has(to) ?? false;
}
