// Cypress accessibility test for Cars.na admin dashboard
// Follows cursorrules from awesome-cursorrules

describe('Admin Dashboard Accessibility', () => {
  beforeEach(() => {
    // Mock authentication to access admin dashboard
    cy.intercept('POST', '**/api/auth/session', {
      body: {
        user: {
          id: 'test-admin-id',
          name: 'Test Admin',
          email: 'admin@cars.na',
          role: 'ADMIN'
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    }).as('sessionCheck');
    
    cy.visit('/admin');
    cy.wait('@sessionCheck');
  });

  it('should have no accessibility violations on the admin dashboard', () => {
    cy.wickA11y();
  });

  it('should have accessible sidebar navigation', () => {
    // Check sidebar navigation has proper ARIA role
    cy.get('[data-testid="admin-sidebar"]')
      .should('have.attr', 'role', 'navigation')
      .should('have.attr', 'aria-label', 'Admin navigation');
    
    // Check nav items have proper ARIA attributes
    cy.get('[data-testid="admin-sidebar"] a')
      .each(($el) => {
        cy.wrap($el)
          .should('have.attr', 'aria-current', ($el.hasClass('active') ? 'page' : 'false'));
      });
  });

  it('should allow keyboard navigation through admin sections', () => {
    // Navigate through main admin elements with keyboard
    cy.get('body').tab();
    
    // First tab should focus on skip link
    cy.focused().should('have.attr', 'data-testid', 'skip-to-content');
    cy.focused().tab();
    
    // Second tab should focus on first nav item
    cy.focused().should('have.attr', 'data-testid', 'nav-users');
    cy.focused().tab();
    
    // Continue tabbing through nav items
    cy.focused().should('have.attr', 'data-testid', 'nav-dealerships');
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'nav-settings');
  });

  it('should have accessible user management table', () => {
    // Navigate to users section
    cy.get('[data-testid="nav-users"]').click();
    
    // Check table has proper ARIA attributes
    cy.get('[data-testid="users-table"]')
      .should('have.attr', 'role', 'table')
      .should('have.attr', 'aria-label', 'User management');
    
    // Check table headers have proper roles
    cy.get('[data-testid="users-table"] thead th')
      .should('have.attr', 'scope', 'col');
    
    // Check table has proper caption for screen readers
    cy.get('[data-testid="users-table"] caption')
      .should('exist');
  });

  it('should have accessible modals for user actions', () => {
    // Navigate to users section
    cy.get('[data-testid="nav-users"]').click();
    
    // Open user edit modal
    cy.get('[data-testid="edit-user-btn"]').first().click();
    
    // Check modal has proper ARIA attributes
    cy.get('[data-testid="user-modal"]')
      .should('have.attr', 'role', 'dialog')
      .should('have.attr', 'aria-modal', 'true')
      .should('have.attr', 'aria-labelledby', 'user-modal-title');
    
    // Check modal title is properly associated
    cy.get('#user-modal-title').should('exist');
    
    // Check focus is trapped in modal
    cy.focused().tab().tab().tab().tab().tab();
    cy.focused().should('be.visible')
      .should('be.contained.within', '[data-testid="user-modal"]');
    
    // Check escape key closes modal
    cy.get('body').type('{esc}');
    cy.get('[data-testid="user-modal"]').should('not.exist');
  });

  it('should have accessible form controls in settings page', () => {
    // Navigate to settings section
    cy.get('[data-testid="nav-settings"]').click();
    
    // Check form controls have proper labels
    cy.get('[data-testid="settings-form"] input, [data-testid="settings-form"] select')
      .each(($el) => {
        // Each form control should have an associated label or aria-label
        const id = $el.attr('id');
        if (id) {
          cy.get(`label[for="${id}"]`).should('exist');
        } else {
          cy.wrap($el).should('have.attr', 'aria-label');
        }
      });
    
    // Check form sections have proper headings
    cy.get('[data-testid="settings-form"] fieldset')
      .should('have.descendants', 'legend');
  });

  it('should announce status messages to screen readers', () => {
    // Navigate to settings section
    cy.get('[data-testid="nav-settings"]').click();
    
    // Submit form to trigger status message
    cy.get('[data-testid="save-settings-btn"]').click();
    
    // Check status message has proper ARIA attributes
    cy.get('[data-testid="status-message"]')
      .should('be.visible')
      .should('have.attr', 'role', 'status')
      .should('have.attr', 'aria-live', 'polite');
  });
});
