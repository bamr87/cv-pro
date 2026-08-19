describe('CV Builder End-to-End Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow user to fill CV details and export', () => {
    // Fill Personal Info
    cy.get('input[id="fullName"]').type('Test User');
    cy.get('input[id="email"]').type('test@example.com');
    cy.get('input[id="phone"]').type('123-456-7890');
    cy.get('input[id="location"]').type('Test City');
    cy.get('textarea[id="summary"]').type('Test summary');

    // Navigate to Experience tab
    cy.contains('Experience').click();
    cy.contains('Add Experience').click();
    cy.get('input[placeholder="Company Name"]').type('Test Company');
    cy.get('input[placeholder="Job Title"]').type('Test Position');
    cy.get('input[type="month"]').first().type('2020-01');
    cy.get('input[type="month"]').last().type('2023-01');
    cy.get('textarea[placeholder="Brief description"]').type('Test description');

    // Navigate to Export tab
    cy.contains('Export').click();
    cy.contains('Export as MARKDOWN').click();

    // Basic assertion - check if toast appears
    cy.get('.sonner-toast').should('be.visible').contains('CV exported as Markdown');
  });

  it('should import a cv.json data file (bamr87/cv round-trip)', () => {
    cy.contains('Export').click();
    cy.get('[data-testid="import-cv-json"]').selectFile('cypress/fixtures/cv.json', { force: true });

    // Import lands back on the Personal tab with the fixture's data loaded
    cy.get('input[id="fullName"]').should('have.value', 'Roundtrip Tester');
    cy.get('input[id="email"]').should('have.value', 'roundtrip@example.com');

    // The experience entry (including the location extension) came through
    cy.contains('Experience').click();
    cy.get('input[placeholder="Company Name"]').should('have.value', 'Fixture Corp');
    cy.get('input[placeholder="City, State"]').first().should('have.value', 'Denver, CO');
  });
});
