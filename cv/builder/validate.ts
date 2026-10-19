// Structural validator for data/cv.json against the CVData contract
// (builder/types.ts, shared with bamr87/cv-builder-pro). Dependency-free by
// design: errors fail the build, warnings are printed but tolerated.

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

type Field = { name: string; kind: 'string' | 'boolean' | 'string[]'; required: boolean };

const PERSONAL_FIELDS: Field[] = [
  { name: 'fullName', kind: 'string', required: true },
  { name: 'email', kind: 'string', required: true },
  { name: 'phone', kind: 'string', required: true },
  { name: 'location', kind: 'string', required: true },
  { name: 'website', kind: 'string', required: false },
  { name: 'linkedin', kind: 'string', required: false },
  { name: 'github', kind: 'string', required: false },
  { name: 'summary', kind: 'string', required: true }
];

const EXPERIENCE_FIELDS: Field[] = [
  { name: 'id', kind: 'string', required: true },
  { name: 'company', kind: 'string', required: true },
  { name: 'position', kind: 'string', required: true },
  { name: 'startDate', kind: 'string', required: true },
  { name: 'endDate', kind: 'string', required: true },
  { name: 'current', kind: 'boolean', required: true },
  { name: 'description', kind: 'string', required: true },
  { name: 'achievements', kind: 'string[]', required: true },
  { name: 'location', kind: 'string', required: false }
];

const EDUCATION_FIELDS: Field[] = [
  { name: 'id', kind: 'string', required: true },
  { name: 'institution', kind: 'string', required: true },
  { name: 'degree', kind: 'string', required: true },
  { name: 'field', kind: 'string', required: true },
  { name: 'startDate', kind: 'string', required: true },
  { name: 'endDate', kind: 'string', required: true },
  { name: 'gpa', kind: 'string', required: false },
  { name: 'honors', kind: 'string', required: false },
  { name: 'location', kind: 'string', required: false }
];

const PROJECT_FIELDS: Field[] = [
  { name: 'id', kind: 'string', required: true },
  { name: 'name', kind: 'string', required: true },
  { name: 'description', kind: 'string', required: true },
  { name: 'technologies', kind: 'string[]', required: true },
  { name: 'url', kind: 'string', required: false },
  { name: 'github', kind: 'string', required: false },
  { name: 'startDate', kind: 'string', required: true },
  { name: 'endDate', kind: 'string', required: false }
];

const SKILL_FIELDS: Field[] = [
  { name: 'category', kind: 'string', required: true },
  { name: 'skills', kind: 'string[]', required: true }
];

const TOP_LEVEL_KEYS = [
  '$schema',
  'personalInfo',
  'experience',
  'education',
  'projects',
  'skills',
  'certifications',
  'languages'
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function checkFields(obj: Record<string, unknown>, fields: Field[], path: string, out: ValidationResult): void {
  for (const field of fields) {
    const value = obj[field.name];
    if (value === undefined) {
      if (field.required) out.errors.push(`${path}.${field.name}: missing required field`);
      continue;
    }
    const ok =
      field.kind === 'string' ? typeof value === 'string'
      : field.kind === 'boolean' ? typeof value === 'boolean'
      : isStringArray(value);
    if (!ok) out.errors.push(`${path}.${field.name}: expected ${field.kind}`);
  }
  const known = new Set(fields.map((f) => f.name));
  for (const key of Object.keys(obj)) {
    if (!known.has(key)) out.warnings.push(`${path}.${key}: unknown field (kept for round-trip, but not rendered)`);
  }
}

function checkEntryList(
  value: unknown,
  fields: Field[],
  path: string,
  out: ValidationResult
): void {
  if (!Array.isArray(value)) {
    out.errors.push(`${path}: expected an array`);
    return;
  }
  const ids = new Set<string>();
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      out.errors.push(`${path}[${index}]: expected an object`);
      return;
    }
    checkFields(entry, fields, `${path}[${index}]`, out);
    const id = entry['id'];
    if (typeof id === 'string' && id) {
      if (ids.has(id)) out.errors.push(`${path}[${index}].id: duplicate id "${id}"`);
      ids.add(id);
    }
  });
}

export function validateCVData(value: unknown): ValidationResult {
  const out: ValidationResult = { errors: [], warnings: [] };

  if (!isRecord(value)) {
    out.errors.push('root: expected a JSON object matching the CVData contract');
    return out;
  }

  for (const key of Object.keys(value)) {
    if (!TOP_LEVEL_KEYS.includes(key)) out.warnings.push(`root.${key}: unknown top-level key`);
  }

  if (!isRecord(value['personalInfo'])) {
    out.errors.push('personalInfo: missing or not an object');
  } else {
    checkFields(value['personalInfo'], PERSONAL_FIELDS, 'personalInfo', out);
  }

  checkEntryList(value['experience'], EXPERIENCE_FIELDS, 'experience', out);
  checkEntryList(value['education'], EDUCATION_FIELDS, 'education', out);
  checkEntryList(value['projects'], PROJECT_FIELDS, 'projects', out);

  if (!Array.isArray(value['skills'])) {
    out.errors.push('skills: expected an array');
  } else {
    (value['skills'] as unknown[]).forEach((entry, index) => {
      if (!isRecord(entry)) {
        out.errors.push(`skills[${index}]: expected an object`);
        return;
      }
      checkFields(entry, SKILL_FIELDS, `skills[${index}]`, out);
    });
  }

  for (const listKey of ['certifications', 'languages'] as const) {
    if (!isStringArray(value[listKey])) out.errors.push(`${listKey}: expected an array of strings`);
  }

  return out;
}
