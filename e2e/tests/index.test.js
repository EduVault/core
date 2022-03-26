/// <reference types="Cypress" />

describe('Index Page', () => {
  it('should be able to ping server', async () => {
    const response = await cy.request('/api/ping');
    expect(response).to.have.property('status', 200);
    expect(response.body).to.have.property('content', 'pong');
  });
  it('should contain a login element', () => {
    cy.visit('/app/login');

    const login = cy.contains('Login with EduVault');
    login.should('exist');
    // login.get('input#username').should('exist');
    // login.get('input#password').should('exist');
    // login.get('button[type="submit"]').should('exist');
  });
});
