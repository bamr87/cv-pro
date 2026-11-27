// A stored CV the schema refuses (cv-pro#29): the builder starts from the empty
// default, says so in a toast, and keeps the stored text under the backup key
// instead of letting the write-back overwrite it.
describe('A stored CV that fails the cv.json schema', () => {
  const bad = JSON.stringify({
    personalInfo: { fullName: 'Stored Person', email: '', phone: '', location: '', summary: '' },
    experience: [{ id: 'e1', company: 'X', position: 'Y', startDate: 'June 2020', endDate: '', current: true, description: '', achievements: [] }],
    education: [], projects: [], skills: [], certifications: [], languages: []
  });

  it('renders the empty default, shows an error toast, and keeps a backup', () => {
    cy.visit('/', { onBeforeLoad: (win) => win.localStorage.setItem('cv-data', bad) });
    cy.contains('[data-sonner-toast]', 'Your saved CV could not be loaded').should('be.visible');
    cy.get('input[id="fullName"]').should('have.value', '');
    cy.window().its('localStorage').invoke('getItem', 'cv-data.rejected-backup').should('equal', bad);
  });

  it('renders the empty default for a value that is not JSON', () => {
    cy.visit('/', { onBeforeLoad: (win) => win.localStorage.setItem('cv-data', '{not json') });
    cy.contains('[data-sonner-toast]', 'it is not valid JSON').should('be.visible');
    cy.get('input[id="fullName"]').should('have.value', '');
    cy.window().its('localStorage').invoke('getItem', 'cv-data.rejected-backup').should('equal', '{not json');
  });
});
