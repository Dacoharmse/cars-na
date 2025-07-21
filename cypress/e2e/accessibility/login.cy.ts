// Example Cypress accessibility test for Cars.na login page
// Follows cursorrules from awesome-cursorrules

describe('Login Page Accessibility', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should have no accessibility violations on login page', () => {
    cy.wickA11y();
  });

  it('should allow keyboard navigation to submit button', () => {
    cy.get('body').tab();
    cy.get('[data-testid="username"]').should('have.focus');
    cy.get('[data-testid="username"]').tab();
    cy.get('[data-testid="password"]').should('have.focus');
    cy.get('[data-testid="password"]').tab();
    cy.get('[data-testid="submit"]').should('have.focus');
  });

  it('should have proper ARIA labels for form fields', () => {
    cy.get('[data-testid="username"]').should(
      'have.attr',
      'aria-label',
      'Username'
    );
    cy.get('[data-testid="password"]').should(
      'have.attr',
      'aria-label',
      'Password'
    );
  });

  it('should announce form errors to screen readers', () => {
    cy.get('[data-testid="submit"]').click();
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .should('have.attr', 'role', 'alert');
  });
});
