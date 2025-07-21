// Cypress accessibility test for Cars.na vehicle listings page
// Follows cursorrules from awesome-cursorrules

describe('Vehicle Listings Page Accessibility', () => {
  beforeEach(() => {
    cy.visit('/vehicles');
  });

  it('should have no accessibility violations on vehicle listings page', () => {
    cy.wickA11y();
  });

  it('should allow keyboard navigation through filter controls', () => {
    cy.get('body').tab();
    // Navigate through filter controls with keyboard
    cy.focused().should('have.attr', 'data-testid', 'make-filter');
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'model-filter');
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'price-min-filter');
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'price-max-filter');
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'apply-filters');
  });

  it('should have proper ARIA attributes on filter components', () => {
    // Check filter section has proper role
    cy.get('[data-testid="filter-section"]')
      .should('have.attr', 'aria-label', 'Filter vehicles');

    // Check price range has proper ARIA attributes
    cy.get('[data-testid="price-min-filter"]')
      .should('have.attr', 'aria-label', 'Minimum price');
    
    cy.get('[data-testid="price-max-filter"]')
      .should('have.attr', 'aria-label', 'Maximum price');
  });

  it('should have accessible vehicle cards with proper semantics', () => {
    // Vehicle cards should be in a list
    cy.get('[data-testid="vehicle-list"]')
      .should('have.attr', 'role', 'list');
    
    // Each vehicle card should be a list item
    cy.get('[data-testid="vehicle-card"]')
      .first()
      .should('have.attr', 'role', 'listitem');
    
    // Vehicle cards should have accessible links
    cy.get('[data-testid="vehicle-card"] a')
      .first()
      .should('have.attr', 'aria-label');
  });

  it('should announce loading state to screen readers', () => {
    // Simulate loading state
    cy.intercept('GET', '**/api/trpc/vehicle.getAll*', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000);
      });
    });
    
    // Trigger a filter action
    cy.get('[data-testid="apply-filters"]').click();
    
    // Check loading indicator has proper ARIA attributes
    cy.get('[data-testid="loading-indicator"]')
      .should('be.visible')
      .should('have.attr', 'role', 'status')
      .should('have.attr', 'aria-live', 'polite');
  });
});
