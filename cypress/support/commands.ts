/* eslint-disable @typescript-eslint/ban-ts-comment */
// cypress/support/commands.ts
// @ts-ignore
Cypress.Commands.add(
  // @ts-ignore
  "register",
  (email: string, password: string, fullName: string, passport: string) => {
    cy.visit("/login");
    cy.get("button").contains("Нет аккаунта? Зарегистрируйтесь").click();
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Пароль"]').type(password);
    cy.get('input[placeholder="ФИО"]').type(fullName);
    cy.get('input[placeholder="Паспортные данные"]').type(passport);
    cy.get('button[type="submit"]').contains("Зарегистрироваться").click();
    cy.wait(1000); // Wait for registration to complete
  }
);

// @ts-ignore
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('input[placeholder="Email"]').type(email);
  cy.get('input[placeholder="Пароль"]').type(password);
  cy.get('button[type="submit"]').contains("Войти").click();
  cy.url().should("eq", "http://localhost:3000/"); // Verify redirect to homepage
});
