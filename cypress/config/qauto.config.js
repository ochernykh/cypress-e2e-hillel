const baseConfig = require("../../cypress.config");

module.exports = {
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: "https://guest:welcome2qauto@qauto.forstudy.space/",
    env: {
      USER_EMAIL: "user+1748868003941@example.com",
      USER_PASSWORD: "Test1234",
    },
  },
};
