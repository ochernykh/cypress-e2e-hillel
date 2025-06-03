const baseConfig = require("../../cypress.config");

module.exports = {
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: "https://guest:welcome2qauto@qauto2.forstudy.space/",
    env: {
      USER_EMAIL: "user+1748868119608@example.com",
      USER_PASSWORD: "Test1234",
    },
  },
};
