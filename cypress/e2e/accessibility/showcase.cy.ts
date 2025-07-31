describe('Homepage Showcase Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should have accessible showcase sections', () => {
    // Wait for showcase to load
    cy.get('[data-testid="home-showcase"]', { timeout: 10000 }).should('be.visible');
    
    // Check overall accessibility
    cy.checkA11y('[data-testid="home-showcase"]', {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-visible': { enabled: true }
      }
    });
  });

  it('should have accessible Top Dealer Picks section', () => {
    cy.get('[data-testid="showcase-top-dealer-picks"]').should('be.visible');
    
    // Check section header accessibility
    cy.get('[data-testid="showcase-top-dealer-picks"] h2')
      .should('have.attr', 'role', 'heading')
      .should('be.visible');
    
    // Check badge accessibility
    cy.get('[data-testid="showcase-top-dealer-picks"] [aria-label="Dealer Pick"]')
      .should('exist')
      .should('be.visible');
    
    cy.checkA11y('[data-testid="showcase-top-dealer-picks"]');
  });

  it('should have accessible Featured Vehicles section', () => {
    cy.get('[data-testid="showcase-featured-vehicles"]').should('be.visible');
    
    // Check badge accessibility
    cy.get('[data-testid="showcase-featured-vehicles"] [aria-label="Featured"]')
      .should('exist')
      .should('be.visible');
    
    cy.checkA11y('[data-testid="showcase-featured-vehicles"]');
  });

  it('should have accessible Top Deals section', () => {
    cy.get('[data-testid="showcase-top-deals"]').should('be.visible');
    
    // Check discount ribbon accessibility
    cy.get('[data-testid="showcase-top-deals"] [data-testid="discount-ribbon"]')
      .should('exist')
      .should('be.visible');
    
    cy.checkA11y('[data-testid="showcase-top-deals"]');
  });

  it('should have accessible Most Viewed section', () => {
    cy.get('[data-testid="showcase-most-viewed"]').should('be.visible');
    
    // Check view count accessibility
    cy.get('[data-testid="showcase-most-viewed"] [aria-label="Popular"]')
      .should('exist')
      .should('be.visible');
    
    cy.checkA11y('[data-testid="showcase-most-viewed"]');
  });

  it('should have accessible New Listings section', () => {
    cy.get('[data-testid="showcase-new-listings"]').should('be.visible');
    
    // Check new badge with pulse animation
    cy.get('[data-testid="showcase-new-listings"] [aria-label="New"]')
      .should('exist')
      .should('be.visible');
    
    cy.checkA11y('[data-testid="showcase-new-listings"]');
  });

  it('should have accessible Top New/Used Cars section', () => {
    cy.get('[data-testid="showcase-top-new-used"]').should('be.visible');
    
    // Check both sub-sections
    cy.get('[data-testid="top-new-cars"]').should('be.visible');
    cy.get('[data-testid="top-used-cars"]').should('be.visible');
    
    // Check popularity rank badges
    cy.get('[data-testid="top-new-cars"] [aria-label^="#"]').should('exist');
    cy.get('[data-testid="top-used-cars"] [aria-label^="#"]').should('exist');
    
    cy.checkA11y('[data-testid="showcase-top-new-used"]');
  });

  it('should support keyboard navigation in carousels', () => {
    // Focus on first carousel
    cy.get('[data-testid="showcase-top-dealer-picks"] .vehicle-carousel')
      .first()
      .focus();
    
    // Test arrow key navigation
    cy.get('body').type('{rightarrow}');
    cy.focused().should('be.visible');
    
    cy.get('body').type('{leftarrow}');
    cy.focused().should('be.visible');
  });

  it('should have proper focus indicators', () => {
    // Test focus on vehicle cards
    cy.get('[data-testid="showcase-top-dealer-picks"] .vehicle-card')
      .first()
      .focus()
      .should('have.focus')
      .should('have.css', 'outline-width')
      .should('not.equal', '0px');
  });

  it('should have accessible carousel scroll behavior', () => {
    // Test horizontal scroll on mobile viewport
    cy.viewport(375, 667);
    
    cy.get('[data-testid="showcase-top-dealer-picks"] .vehicle-carousel')
      .should('have.css', 'overflow-x', 'auto')
      .should('have.css', 'scroll-snap-type');
  });

  it('should maintain accessibility in responsive layouts', () => {
    // Test desktop layout
    cy.viewport(1280, 720);
    cy.checkA11y('[data-testid="home-showcase"]');
    
    // Test tablet layout
    cy.viewport(768, 1024);
    cy.checkA11y('[data-testid="home-showcase"]');
    
    // Test mobile layout
    cy.viewport(375, 667);
    cy.checkA11y('[data-testid="home-showcase"]');
  });
});
