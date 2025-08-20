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
});
