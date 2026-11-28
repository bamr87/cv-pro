// Completeness gate for the app's Markdown and ASCII exports (bamr87/cv-pro#28).
// Runs as part of `npm test` (node:test via tsx). It drives the exporter module
// ExportSection.tsx calls, with a fixture that fills every optional section the
// committed cv/data/cv.json leaves empty (certifications, languages), so a
// dropped section or a raw YYYY-MM date fails here instead of shipping silently.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { CVData } from '../src/types/cv.ts';
import { exportToMarkdown, exportToASCII } from '../src/lib/cv-exporters.ts';

const fixture: CVData = {
  personalInfo: {
    fullName: 'Ada Example',
    email: 'ada@example.com',
    phone: '+1 555 0100',
    location: 'Seattle, WA',
    website: 'https://ada.example.com',
    linkedin: 'https://www.linkedin.com/in/ada-example',
    github: 'https://github.com/ada-example',
    summary: 'Engineer who ships.'
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Analytical Engines',
      position: 'Lead Engineer',
      startDate: '2020-01',
      endDate: '2022-06',
      current: false,
      description: 'Built the difference engine.',
      achievements: ['Cut costs 40%'],
      location: 'London, UK'
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Example University',
      degree: 'BSc',
      field: 'Mathematics',
      startDate: '2014-09',
      endDate: '2018-05'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Note G',
      description: 'The first published algorithm.',
      technologies: ['Punch cards'],
      url: 'https://noteg.example.com',
      github: 'https://github.com/ada-example/note-g',
      startDate: '2021-03',
      endDate: '2021-09'
    }
  ],
  skills: [{ category: 'Languages', skills: ['TypeScript', 'Python'] }],
  certifications: ['Certified Kubernetes Administrator'],
  languages: ['English', 'French']
};

const outputs = {
  markdown: exportToMarkdown(fixture),
  ascii: exportToASCII(fixture)
};

for (const [format, out] of Object.entries(outputs)) {
  test(`${format} export carries every section, link, location and formatted date`, () => {
    for (const section of ['Projects', 'Certifications', 'Languages']) {
      assert.match(out, new RegExp(section, 'i'), `${format}: has a ${section} section`);
    }
    assert.ok(out.includes('Note G'), `${format}: project listed`);
    assert.ok(out.includes('Certified Kubernetes Administrator'), `${format}: certification listed`);
    assert.ok(out.includes('English, French'), `${format}: languages listed`);
    assert.ok(out.includes(fixture.personalInfo.linkedin!), `${format}: LinkedIn link`);
    assert.ok(out.includes(fixture.personalInfo.github!), `${format}: GitHub link`);
    assert.ok(out.includes('London, UK'), `${format}: experience location`);
    assert.ok(out.includes('Jan 2020'), `${format}: formatted date range`);
    assert.ok(!out.includes('2020-01'), `${format}: no raw YYYY-MM date`);
  });
}
