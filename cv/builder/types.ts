// CVData model — ported from bamr87/cv-builder-pro (src/types/cv.ts).
// This shape IS the integration contract: data/cv.json round-trips losslessly
// with CV Builder Pro's import/export, so keep the two files field-compatible.
// `location` on Experience/Education is an optional extension the app's LaTeX
// templates already consume.

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  location?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate?: string;
}

export interface Skill {
  category: string;
  skills: string[];
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  certifications: string[];
  languages: string[];
}

export const defaultCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: []
};

// "2020-01" (the app's <input type="month"> format) -> "Jan 2020".
// Anything that isn't YYYY-MM passes through untouched.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(value: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(value);
  if (!m) return value;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return value;
  return `${MONTHS[month - 1]} ${m[1]}`;
}

export function formatRange(start: string, end: string, current: boolean): string {
  return `${formatDate(start)} – ${current ? 'Present' : formatDate(end)}`;
}
