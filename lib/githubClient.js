"use strict";

// Cliente centralizado de Octokit para las funciones serverless de GitHub.

let octokitModulePromise = null;

async function loadOctokitModule() {
  if (!octokitModulePromise) {
    octokitModulePromise = import("@octokit/rest");
  }

  return octokitModulePromise;
}

async function createOctokit() {
  const { Octokit } = await loadOctokitModule();
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

