// parseCVData / normalizeCVData validate against contract/cv.schema.json (Ajv),
// so an import cannot smuggle a non-YYYY-MM date or drop a required field.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cvDataErrors, isValidCVData, normalizeCVData, parseCVData, serializeCVData } from './cv-json';
import { defaultCVData } from '../types/cv';

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const fixture = () => JSON.parse(read('../../cypress/fixtures/cv.json'));

describe('parseCVData', () => {
  it('accepts the Cypress fixture and the build machine\'s data/cv.json', () => {
    expect(parseCVData(read('../../cypress/fixtures/cv.json')).personalInfo.fullName).toBe('Roundtrip Tester');
    expect(parseCVData(read('../../../cv/data/cv.json')).experience.length).toBeGreaterThan(0);
  });

  it('round-trips its own export', () => {
    const data = parseCVData(read('../../cypress/fixtures/cv.json'));
    expect(parseCVData(serializeCVData(data))).toEqual(data);
  });

  it('rejects a date that is not YYYY-MM, naming the path', () => {
    const cv = fixture();
    cv.experience[0].startDate = 'June 2020';
    expect(() => parseCVData(JSON.stringify(cv))).toThrow(/\/experience\/0\/startDate must match pattern/);
  });

  it('rejects a missing required field, naming the path', () => {
    const cv = fixture();
    delete cv.personalInfo.email;
    expect(() => parseCVData(JSON.stringify(cv))).toThrow(/\/personalInfo must have required property 'email'/);
  });

  it('rejects text that is not a JSON object', () => {
    expect(() => parseCVData('nope')).toThrow('Not valid JSON');
    expect(() => parseCVData('[]')).toThrow('Expected a JSON object');
  });
});

describe('normalizeCVData (AI responses)', () => {
  it('backfills ids and absent sections, then validates', () => {
    const data = normalizeCVData(JSON.stringify({
      personalInfo: { fullName: 'A', email: 'a@example.com', phone: '', location: '', summary: '' },
      experience: [{ company: 'X', position: 'Y', startDate: '2020-01', endDate: '', current: true, description: '', achievements: [] }],
    }));
    expect(data.experience[0].id).toMatch(/^exp-/);
    expect(data.education).toEqual([]);
    expect(isValidCVData(data)).toBe(true);
  });

  it('still rejects a date the schema refuses', () => {
    expect(() => normalizeCVData(JSON.stringify({
      personalInfo: { fullName: 'A' },
      experience: [{ company: 'X', startDate: 'June 2020' }],
    }))).toThrow(/\/experience\/0\/startDate must match pattern/);
  });
});

describe('cvDataErrors', () => {
  it('passes the empty default CV', () => {
    expect(cvDataErrors(defaultCVData)).toEqual([]);
  });
});
