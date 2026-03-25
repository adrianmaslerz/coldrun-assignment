import { InMemoryTruckRepository } from './in-memory-truck.repository';
import { Truck } from '../domain/aggregates/truck.aggregate';
import { TruckStatus } from '../domain/enums/truck-status.enum';

const makeProps = (overrides: Partial<ReturnType<Truck['toProps']>> = {}) => ({
  id: 'uuid-1',
  code: 'TRUCK001',
  name: 'Volvo FH16',
  status: TruckStatus.OUT_OF_SERVICE,
  description: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

const makeTruck = (overrides: Partial<ReturnType<Truck['toProps']>> = {}) =>
  Truck.fromProps(makeProps(overrides));

describe('InMemoryTruckRepository', () => {
  let repo: InMemoryTruckRepository;

  beforeEach(() => {
    repo = new InMemoryTruckRepository();
  });

  describe('save & findById', () => {
    it('saves and retrieves truck by id', async () => {
      const truck = makeTruck();

      await repo.save(truck);
      const found = await repo.findById('uuid-1');

      expect(found?.toProps()).toEqual(truck.toProps());
    });

    it('returns null when id not found', async () => {
      const result = await repo.findById('non-existent');

      expect(result).toBeNull();
    });

    it('overwrites existing truck on save', async () => {
      const truck = makeTruck();
      await repo.save(truck);

      const updated = makeTruck({ name: 'Scania R500' });
      await repo.save(updated);
      const found = await repo.findById('uuid-1');

      expect(found?.name).toBe('Scania R500');
    });
  });

  describe('findByCode', () => {
    it('returns truck matching code', async () => {
      await repo.save(makeTruck());
      const found = await repo.findByCode('TRUCK001');

      expect(found?.code).toBe('TRUCK001');
    });

    it('returns null when code not found', async () => {
      const result = await repo.findByCode('MISSING');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('removes truck from store', async () => {
      await repo.save(makeTruck());
      await repo.delete('uuid-1');
      const found = await repo.findById('uuid-1');

      expect(found).toBeNull();
    });

    it('does nothing when id does not exist', async () => {
      await expect(repo.delete('non-existent')).resolves.toBeUndefined();
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await repo.save(
        makeTruck({
          id: '1',
          code: 'AAA',
          name: 'Alpha',
          status: TruckStatus.OUT_OF_SERVICE,
        }),
      );
      await repo.save(
        makeTruck({
          id: '2',
          code: 'BBB',
          name: 'Beta',
          status: TruckStatus.LOADING,
        }),
      );
      await repo.save(
        makeTruck({
          id: '3',
          code: 'CCC',
          name: 'Gamma',
          status: TruckStatus.TO_JOB,
        }),
      );
    });

    it('returns all trucks without filters', async () => {
      const results = await repo.findAll();

      expect(results).toHaveLength(3);
    });

    it('filters by status', async () => {
      const results = await repo.findAll({ status: TruckStatus.LOADING });

      expect(results).toHaveLength(1);
      expect(results[0].code).toBe('BBB');
    });

    it('filters by code (partial, case-insensitive)', async () => {
      const results = await repo.findAll({ code: 'aa' });

      expect(results).toHaveLength(1);
      expect(results[0].code).toBe('AAA');
    });

    it('filters by name (partial, case-insensitive)', async () => {
      const results = await repo.findAll({ name: 'eta' });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Beta');
    });

    it('sorts by name asc', async () => {
      const results = await repo.findAll({}, { sortBy: 'name', order: 'asc' });

      expect(results.map((t) => t.name)).toEqual(['Alpha', 'Beta', 'Gamma']);
    });

    it('sorts by name desc', async () => {
      const results = await repo.findAll({}, { sortBy: 'name', order: 'desc' });

      expect(results.map((t) => t.name)).toEqual(['Gamma', 'Beta', 'Alpha']);
    });

    it('combines filter and sort', async () => {
      await repo.save(
        makeTruck({
          id: '4',
          code: 'DDD',
          name: 'Delta',
          status: TruckStatus.LOADING,
        }),
      );

      const results = await repo.findAll(
        { status: TruckStatus.LOADING },
        { sortBy: 'name', order: 'asc' },
      );

      expect(results.map((t) => t.name)).toEqual(['Beta', 'Delta']);
    });
  });
});
