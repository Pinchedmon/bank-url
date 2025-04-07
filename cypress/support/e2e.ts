/* eslint-disable @typescript-eslint/no-unused-vars */
// cypress/support/e2e.ts
import "./commands";

Cypress.on("uncaught:exception", (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  return false;
});
