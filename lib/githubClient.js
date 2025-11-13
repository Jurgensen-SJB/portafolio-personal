"use strict";

// Cliente centralizado de Octokit para las funciones serverless de GitHub.

const { Octokit } = require("@octokit/rest");

function createOctokit() {
  const token = process.env.GITHUB_TOKEN;

  const options = {
    userAgent: "portafolio-personal-backend",
    request: {
      timeout: 10000
    }
  };

  if (token) {
    options.auth = token;
  }

  return new Octokit(options);
}

module.exports = {
  createOctokit
};

