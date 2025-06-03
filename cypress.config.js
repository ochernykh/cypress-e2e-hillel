const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    fixturesFolder: "cypress/fixtures",
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    video: true,
    videosFolder: "cypress/videos",
    chromeWebSecurity: false,
    trashAssetsBeforeRuns: true,
  },
});
