// Cypress accessibility test for Cars.na "Sell Your Car" wizard
// Follows cursorrules from awesome-cursorrules

describe('Sell Your Car Wizard Accessibility', () => {
  beforeEach(() => {
    cy.visit('/sell');
  });

  it('should have no accessibility violations on the wizard landing page', () => {
    cy.wickA11y();
  });

  it('should maintain focus management through wizard steps', () => {
    // Start the wizard
    cy.get('[data-testid="start-wizard-btn"]').click();
    
    // First step should receive focus
    cy.get('[data-testid="step-1-heading"]').should('have.focus');
    
    // Fill out first step (vehicle details)
    cy.get('[data-testid="make-input"]').type('Toyota');
    cy.get('[data-testid="model-input"]').type('Camry');
    cy.get('[data-testid="year-input"]').type('2020');
    cy.get('[data-testid="mileage-input"]').type('45000');
    cy.get('[data-testid="next-step-btn"]').click();
    
    // Second step should receive focus
    cy.get('[data-testid="step-2-heading"]').should('have.focus');
  });

  it('should have proper ARIA attributes for multi-step form', () => {
    // Start the wizard
    cy.get('[data-testid="start-wizard-btn"]').click();
    
    // Check wizard container has proper ARIA role
    cy.get('[data-testid="wizard-container"]')
      .should('have.attr', 'role', 'region')
      .should('have.attr', 'aria-labelledby', 'wizard-title');
    
    // Check progress indicator has proper ARIA attributes
    cy.get('[data-testid="wizard-progress"]')
      .should('have.attr', 'role', 'progressbar')
      .should('have.attr', 'aria-valuemin', '0')
      .should('have.attr', 'aria-valuemax', '100')
      .should('have.attr', 'aria-valuenow');
  });

  it('should announce form validation errors to screen readers', () => {
    // Start the wizard
    cy.get('[data-testid="start-wizard-btn"]').click();
    
    // Try to proceed without filling required fields
    cy.get('[data-testid="next-step-btn"]').click();
    
    // Check error messages have proper ARIA attributes
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .should('have.attr', 'role', 'alert')
      .should('have.attr', 'aria-live', 'assertive');
  });

  it('should allow keyboard navigation through photo upload interface', () => {
    // Start the wizard and navigate to photo upload step
    cy.get('[data-testid="start-wizard-btn"]').click();
    cy.get('[data-testid="make-input"]').type('Toyota');
    cy.get('[data-testid="model-input"]').type('Camry');
    cy.get('[data-testid="year-input"]').type('2020');
    cy.get('[data-testid="mileage-input"]').type('45000');
    cy.get('[data-testid="next-step-btn"]').click();
    cy.get('[data-testid="next-step-btn"]').click(); // Assume step 3 is photo upload
    
    // Check photo upload area is keyboard accessible
    cy.get('[data-testid="photo-upload-area"]')
      .should('have.attr', 'tabindex', '0')
      .focus()
      .should('have.focus')
      .should('have.attr', 'role', 'button')
      .should('have.attr', 'aria-label', 'Upload vehicle photos');
  });
});
