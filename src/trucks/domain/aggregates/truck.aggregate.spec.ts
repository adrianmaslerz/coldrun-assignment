import { Truck } from './truck.aggregate';
import { TruckStatus } from '../enums/truck-status.enum';
import { InvalidStatusTransitionException } from '../exceptions';

const makeProps = () => ({
  id: 'uuid-1',
  code: 'TRUCK001',
  name: 'Volvo FH16',
  status: TruckStatus.OUT_OF_SERVICE,
  description: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

describe('Truck', () => {
  describe('create', () => {
    it('sets provided fields', () => {
      const truck = Truck.create({
        code: 'TRUCK001',
        name: 'Volvo FH16',
        status: TruckStatus.LOADING,
        description: 'desc',
      });

      expect(truck.code).toBe('TRUCK001');
      expect(truck.name).toBe('Volvo FH16');
      expect(truck.status).toBe(TruckStatus.LOADING);
      expect(truck.description).toBe('desc');
    });

    it('defaults status to OUT_OF_SERVICE when not provided', () => {
      const truck = Truck.create({ code: 'TRUCK001', name: 'Volvo FH16' });

      expect(truck.status).toBe(TruckStatus.OUT_OF_SERVICE);
    });

    it('defaults description to null when not provided', () => {
      const truck = Truck.create({ code: 'TRUCK001', name: 'Volvo FH16' });

      expect(truck.description).toBeNull();
    });

    it('generates unique ids', () => {
      const a = Truck.create({ code: 'A', name: 'A' });
      const b = Truck.create({ code: 'B', name: 'B' });

      expect(a.id).not.toBe(b.id);
    });
  });

  describe('fromProps', () => {
    it('restores truck from props', () => {
      const props = makeProps();
      const truck = Truck.fromProps(props);

      expect(truck.toProps()).toEqual(props);
    });
  });

  describe('update', () => {
    it('updates code', () => {
      const truck = Truck.fromProps(makeProps());
      truck.update({ code: 'NEWCODE' });

      expect(truck.code).toBe('NEWCODE');
    });

    it('updates name', () => {
      const truck = Truck.fromProps(makeProps());
      truck.update({ name: 'Scania R500' });

      expect(truck.name).toBe('Scania R500');
    });

    it('updates description', () => {
      const truck = Truck.fromProps(makeProps());
      truck.update({ description: 'new desc' });

      expect(truck.description).toBe('new desc');
    });

    it('clears description when set to null', () => {
      const truck = Truck.fromProps({ ...makeProps(), description: 'old' });
      truck.update({ description: null });

      expect(truck.description).toBeNull();
    });

    it('does not change fields when update props are undefined', () => {
      const truck = Truck.fromProps(makeProps());
      truck.update({});

      expect(truck.code).toBe('TRUCK001');
      expect(truck.name).toBe('Volvo FH16');
      expect(truck.status).toBe(TruckStatus.OUT_OF_SERVICE);
      expect(truck.description).toBeNull();
    });

    it('updates updatedAt on every update', () => {
      const truck = Truck.fromProps(makeProps());
      const before = truck.updatedAt;

      truck.update({ name: 'New Name' });

      expect(truck.updatedAt.getTime()).toBeGreaterThan(before.getTime());
    });

    it('allows valid status transition', () => {
      const truck = Truck.fromProps(makeProps());
      truck.update({ status: TruckStatus.LOADING });

      expect(truck.status).toBe(TruckStatus.LOADING);
    });

    it('throws InvalidStatusTransitionException on invalid transition', () => {
      const truck = Truck.fromProps({
        ...makeProps(),
        status: TruckStatus.LOADING,
      });

      expect(() => truck.update({ status: TruckStatus.AT_JOB })).toThrow(
        InvalidStatusTransitionException,
      );
    });
  });

  describe('toProps', () => {
    it('returns all fields', () => {
      const props = makeProps();
      const truck = Truck.fromProps(props);

      expect(truck.toProps()).toEqual(props);
    });
  });
});
