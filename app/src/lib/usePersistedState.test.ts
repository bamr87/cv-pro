// readPersisted is the hook's first read: a stored CV the schema refuses (or
// that is not JSON) yields the default, and the raw text survives under the
// backup key, before the hook's write-back overwrites `cv-data`.
import { describe, expect, it } from 'vitest';
import { backupKeyFor, readPersisted } from './usePersistedState';
import { isValidCVData } from './cv-json';
import { defaultCVData, type CVData } from '../types/cv';

function memoryStorage(seed: Record<string, string> = {}) {
  const items = new Map(Object.entries(seed));
  return {
    items,
    getItem: (k: string) => items.get(k) ?? null,
    setItem: (k: string, v: string) => void items.set(k, v),
  };
}

describe('readPersisted', () => {
  it('returns the initial value when nothing is stored', () => {
    const storage = memoryStorage();
    expect(readPersisted<CVData>(storage, 'cv-data', defaultCVData, isValidCVData)).toEqual({ value: defaultCVData });
    expect(storage.items.size).toBe(0);
  });

  it('loads a stored CV that conforms', () => {
    const stored = { ...defaultCVData, personalInfo: { ...defaultCVData.personalInfo, fullName: 'Kept' } };
    const storage = memoryStorage({ 'cv-data': JSON.stringify(stored) });
    const read = readPersisted<CVData>(storage, 'cv-data', defaultCVData, isValidCVData);
    expect(read.value).toEqual(stored);
    expect(read.rejected).toBeUndefined();
  });

  it('refuses a CV that breaks the schema, keeping the raw text under the backup key', () => {
    const bad = JSON.stringify({ ...defaultCVData, experience: [{ id: 'e', company: 'X', position: 'Y', startDate: 'June 2020', endDate: '', current: true, description: '', achievements: [] }] });
    const storage = memoryStorage({ 'cv-data': bad });
    const read = readPersisted<CVData>(storage, 'cv-data', defaultCVData, isValidCVData);
    expect(read.value).toBe(defaultCVData);
    expect(read.rejected).toEqual({ key: 'cv-data', backupKey: 'cv-data.rejected-backup', reason: 'it does not match the cv.json schema' });
    expect(storage.items.get(backupKeyFor('cv-data'))).toBe(bad);
  });

  it('refuses a value that is not JSON, keeping it under the backup key', () => {
    const storage = memoryStorage({ 'cv-data': '{not json' });
    const read = readPersisted<CVData>(storage, 'cv-data', defaultCVData, isValidCVData);
    expect(read.value).toBe(defaultCVData);
    expect(read.rejected?.reason).toBe('it is not valid JSON');
    expect(storage.items.get('cv-data.rejected-backup')).toBe('{not json');
  });
});
