/// <reference types="Cypress" />

const PORT = 10443;
const baseUrl = 'https://localhost:' + PORT;
describe('Index Page', () => {
  it('should be able to ping server', async () => {
    const response = await cy.request(baseUrl + '/api/ping');
    console.log({ response });
    expect(response).to.have.property('status', 200);
    expect(response).to.have.property('body', 'pong');
  });
  it('should contain a login element', () => {
    cy.visit(baseUrl + '/app/login');

    const login = cy.contains('login');
    login.should('exist');
    // login.get('input#username').should('exist');
    // login.get('input#password').should('exist');
    // login.get('button[type="submit"]').should('exist');
  });
});
