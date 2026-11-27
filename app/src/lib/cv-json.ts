import Ajv from 'ajv';
import { CVData, defaultCVData, Education, Experience, Project, Skill } from '../types/cv';
import cvSchema from '../../contract/cv.schema.json';

// Canonical JSON round-trip with cv/data/cv.json in this repo.
//
// `serializeCVData` produces that file (Export → JSON) and `parseCVData` reads
// it back (Import cv.json), so a CV can move freely between the forms here and
// the build machine in cv/ (which renders Markdown/ASCII/LaTeX/HTML/PDF from
// the same shape — see https://github.com/bamr87/cv-pro).

// The one schema validator the app ships: Ajv over contract/cv.schema.json,
// the byte-identical copy of the contract the build machine (cv/) enforces.
// Compiled once, at module load. An import, a stored CV and an AI response all
// pass through it, so nothing outside the contract reaches the forms.
const validateSchema = new Ajv({ allErrors: true, strict: false }).compile<CVData>(cvSchema);

/** Every way `value` breaks the CVData contract, as `<path> <message>`; empty when it conforms. */
export function cvDataErrors(value: unknown): string[] {
  if (validateSchema(value)) return [];
  return (validateSchema.errors ?? []).map((e) => `${e.instancePath || '/'} ${e.message ?? 'is invalid'}`);
}

/** True when `value` is a CVData the contract accepts. */
export function isValidCVData(value: unknown): value is CVData {
  return cvDataErrors(value).length === 0;
}

function assertValidCVData(value: unknown, what: string): void {
  const errors = cvDataErrors(value);
  if (errors.length === 0) return;
  const more = errors.length > 3 ? ` (and ${errors.length - 3} more)` : '';
  throw new Error(`${what} does not match the cv.json schema: ${errors.slice(0, 3).join('; ')}${more}`);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asOptString(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined;
}

export function serializeCVData(data: CVData): string {
  // Stable key order (the contract's order) so diffs against the repo copy
  // stay minimal no matter what order the state object's keys are in.
  const ordered: CVData = {
    personalInfo: {
      fullName: data.personalInfo.fullName,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      location: data.personalInfo.location,
      website: data.personalInfo.website,
      linkedin: data.personalInfo.linkedin,
      github: data.personalInfo.github,
      summary: data.personalInfo.summary
    },
    experience: data.experience.map((exp) => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
      achievements: exp.achievements,
      ...(exp.location ? { location: exp.location } : {})
    })),
    education: data.education.map((edu) => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      ...(edu.gpa ? { gpa: edu.gpa } : {}),
      ...(edu.honors ? { honors: edu.honors } : {}),
      ...(edu.location ? { location: edu.location } : {})
    })),
    projects: data.projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      ...(project.url ? { url: project.url } : {}),
      ...(project.github ? { github: project.github } : {}),
      startDate: project.startDate,
      ...(project.endDate ? { endDate: project.endDate } : {})
    })),
    skills: data.skills.map((group) => ({ category: group.category, skills: group.skills })),
    certifications: data.certifications,
    languages: data.languages
  };
  return JSON.stringify(ordered, null, 2) + '\n';
}

function readObject(text: string): Record<string, unknown> {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Not valid JSON');
  }
  if (!isRecord(raw)) {
    throw new Error('Expected a JSON object in the cv.json format');
  }
  return raw;
}

/**
 * Read a cv.json file (Import cv.json). The file must conform to the contract
 * as it stands: a date that is not YYYY-MM or a missing required field throws,
 * naming the path, instead of being coerced to an empty string.
 */
export function parseCVData(text: string): CVData {
  const raw = readObject(text);
  assertValidCVData(raw, 'This file');
  return coerceCVData(raw);
}

/**
 * Normalize an AI provider's answer, which is CV-shaped but not a cv.json:
 * missing ids are backfilled and absent sections filled, then the result must
 * conform to the contract like any import (so a date such as "June 2020" is
 * still rejected rather than stored).
 */
export function normalizeCVData(text: string): CVData {
  const raw = readObject(text);
  if (!isRecord(raw.personalInfo) || typeof raw.personalInfo.fullName !== 'string') {
    throw new Error('Missing personalInfo.fullName — is this a cv.json file?');
  }
  const data = coerceCVData(raw);
  assertValidCVData(data, 'The parsed CV');
  return data;
}

function coerceCVData(raw: Record<string, unknown>): CVData {
  const personal = isRecord(raw.personalInfo) ? raw.personalInfo : {};
  const stamp = Date.now();

  const experience: Experience[] = (Array.isArray(raw.experience) ? raw.experience : [])
    .filter(isRecord)
    .map((exp, index) => ({
      id: asString(exp.id, `exp-${stamp}-${index}`) || `exp-${stamp}-${index}`,
      company: asString(exp.company),
      position: asString(exp.position),
      startDate: asString(exp.startDate),
      endDate: asString(exp.endDate),
      current: exp.current === true,
      description: asString(exp.description),
      achievements: asStringArray(exp.achievements),
      ...(asOptString(exp.location) ? { location: asOptString(exp.location) } : {})
    }));

  const education: Education[] = (Array.isArray(raw.education) ? raw.education : [])
    .filter(isRecord)
    .map((edu, index) => ({
      id: asString(edu.id, `edu-${stamp}-${index}`) || `edu-${stamp}-${index}`,
      institution: asString(edu.institution),
      degree: asString(edu.degree),
      field: asString(edu.field),
      startDate: asString(edu.startDate),
      endDate: asString(edu.endDate),
      ...(asOptString(edu.gpa) ? { gpa: asOptString(edu.gpa) } : {}),
      ...(asOptString(edu.honors) ? { honors: asOptString(edu.honors) } : {}),
      ...(asOptString(edu.location) ? { location: asOptString(edu.location) } : {})
    }));

  const projects: Project[] = (Array.isArray(raw.projects) ? raw.projects : [])
    .filter(isRecord)
    .map((project, index) => ({
      id: asString(project.id, `proj-${stamp}-${index}`) || `proj-${stamp}-${index}`,
      name: asString(project.name),
      description: asString(project.description),
      technologies: asStringArray(project.technologies),
      ...(asOptString(project.url) ? { url: asOptString(project.url) } : {}),
      ...(asOptString(project.github) ? { github: asOptString(project.github) } : {}),
      startDate: asString(project.startDate),
      ...(asOptString(project.endDate) ? { endDate: asOptString(project.endDate) } : {})
    }));

  const skills: Skill[] = (Array.isArray(raw.skills) ? raw.skills : [])
    .filter(isRecord)
    .map((group) => ({
      category: asString(group.category),
      skills: asStringArray(group.skills)
    }));

  return {
    personalInfo: {
      ...defaultCVData.personalInfo,
      fullName: asString(personal.fullName),
      email: asString(personal.email),
      phone: asString(personal.phone),
      location: asString(personal.location),
      website: asString(personal.website),
      linkedin: asString(personal.linkedin),
      github: asString(personal.github),
      summary: asString(personal.summary)
    },
    experience,
    education,
    projects,
    skills,
    certifications: asStringArray(raw.certifications),
    languages: asStringArray(raw.languages)
  };
}
