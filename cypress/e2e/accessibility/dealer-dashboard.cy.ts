// Cypress accessibility test for Cars.na dealer dashboard
// Follows cursorrules from awesome-cursorrules

describe('Dealer Dashboard Accessibility', () => {
  beforeEach(() => {
    // Mock authentication to access dealer dashboard
    cy.intercept('POST', '**/api/auth/session', {
      body: {
        user: {
          id: 'test-dealer-id',
          name: 'Test Dealer',
          email: 'dealer@example.com',
          role: 'DEALER_PRINCIPAL',
          dealershipId: 'test-dealership-id'
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    }).as('sessionCheck');
    
    cy.visit('/dashboard');
    cy.wait('@sessionCheck');
  });

  it('should have no accessibility violations on the dealer dashboard', () => {
    cy.wickA11y();
  });

  it('should have accessible navigation menu', () => {
    // Check navigation has proper ARIA role
    cy.get('[data-testid="dashboard-nav"]')
      .should('have.attr', 'role', 'navigation')
      .should('have.attr', 'aria-label', 'Dashboard navigation');
    
    // Check nav items have proper ARIA attributes
    cy.get('[data-testid="dashboard-nav"] a')
      .each(($el) => {
        cy.wrap($el)
          .should('have.attr', 'aria-current', ($el.hasClass('active') ? 'page' : 'false'));
      });
  });

  it('should allow keyboard navigation through dashboard components', () => {
    // Navigate through main dashboard elements with keyboard
    cy.get('body').tab();
    
    // First tab should focus on skip link
    cy.focused().should('have.attr', 'data-testid', 'skip-to-content');
    cy.focused().tab();
    
    // Second tab should focus on first nav item
    cy.focused().should('have.attr', 'data-testid', 'nav-inventory');
    cy.focused().tab();
    
    // Continue tabbing through nav items
    cy.focused().should('have.attr', 'data-testid', 'nav-leads');
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'nav-analytics');
  });

  it('should have accessible data tables for inventory management', () => {
    // Navigate to inventory section
    cy.get('[data-testid="nav-inventory"]').click();
    
    // Check table has proper ARIA attributes
    cy.get('[data-testid="inventory-table"]')
      .should('have.attr', 'role', 'table')
      .should('have.attr', 'aria-label', 'Vehicle inventory');
    
    // Check table headers have proper roles
    cy.get('[data-testid="inventory-table"] thead th')
      .should('have.attr', 'scope', 'col');
    
    // Check table has proper caption for screen readers
    cy.get('[data-testid="inventory-table"] caption')
      .should('exist');
  });

  it('should have accessible action buttons with proper labels', () => {
    // Navigate to inventory section
    cy.get('[data-testid="nav-inventory"]').click();
    
    // Check action buttons have proper ARIA labels
    cy.get('[data-testid="add-vehicle-btn"]')
      .should('have.attr', 'aria-label', 'Add new vehicle');
    
    cy.get('[data-testid="edit-vehicle-btn"]').first()
      .should('have.attr', 'aria-label');
    
    cy.get('[data-testid="delete-vehicle-btn"]').first()
      .should('have.attr', 'aria-label');
  });

  it('should announce dynamic content changes to screen readers', () => {
    // Navigate to analytics section
    cy.get('[data-testid="nav-analytics"]').click();
    
    // Check chart containers have proper ARIA attributes
    cy.get('[data-testid="sales-chart"]')
      .should('have.attr', 'role', 'img')
      .should('have.attr', 'aria-label');
    
    // Check data summary is announced to screen readers
    cy.get('[data-testid="data-summary"]')
      .should('have.attr', 'aria-live', 'polite');
    
    // Simulate filter change that updates data
    cy.get('[data-testid="date-filter"]').select('last-month');
    
    // Check loading state is properly announced
    cy.get('[data-testid="loading-indicator"]')
      .should('have.attr', 'role', 'status')
      .should('have.attr', 'aria-live', 'polite');
  });
});
