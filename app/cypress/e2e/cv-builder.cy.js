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
    cy.get('textarea[placeholder^="Brief description"]').type('Test description');

    // Navigate to Export tab
    cy.contains('Export').click();
    cy.contains('Export as MARKDOWN').click();

    // Basic assertion - check if toast appears
    cy.contains('[data-sonner-toast]', 'CV exported as Markdown').should('be.visible');
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

  it('quick-exports the format on the button, not the one in the dropdown', () => {
    // Regression: the Quick Actions used to call setSelectedFormat and then a
    // setTimeout'd handler that still closed over the previous format, so this
    // button exported Markdown (the default selection) instead of LaTeX.
    cy.contains('Export').click();
    cy.get('[data-testid="import-cv-json"]').selectFile('cypress/fixtures/cv.json', { force: true });

    cy.contains('Export').click();
    cy.contains('Export Format').parent().contains('Markdown (.md)');
    cy.contains('Quick Export LaTeX').click();

    cy.contains('[data-sonner-toast]', 'CV exported as LaTeX').should('be.visible');
  });
});
