import {
  isStatusTransitionAllowed,
  ALLOWED_STATUS_TRANSITIONS,
} from './truck-status-transitions';
import { TruckStatus } from '../enums/truck-status.enum';

const ALL_STATUSES = Object.values(TruckStatus);

describe('isStatusTransitionAllowed', () => {
  it.each(ALL_STATUSES)('allows same-status transition: %s → %s', (status) => {
    expect(isStatusTransitionAllowed(status, status)).toBe(true);
  });

  for (const [from, allowedSet] of ALLOWED_STATUS_TRANSITIONS.entries()) {
    for (const to of allowedSet) {
      it(`allows ${from} → ${to}`, () => {
        expect(isStatusTransitionAllowed(from, to)).toBe(true);
      });
    }

    const disallowed = ALL_STATUSES.filter((s) => s !== from && !allowedSet.has(s));
    for (const to of disallowed) {
      it(`disallows ${from} → ${to}`, () => {
        expect(isStatusTransitionAllowed(from, to)).toBe(false);
      });
    }
  }
});
