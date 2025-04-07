/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Adjust if your dev server uses a different port
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // Add any custom plugins here if needed
    },
  },
  env: {
    // Define test user credentials
    testEmail: "testuser@example.com",
    testPassword: "Password123!",
    testFullName: "Test User",
    testPassport: "AB1234567",
  },
});
