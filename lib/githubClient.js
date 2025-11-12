"use strict";

// Cliente centralizado de Octokit para las funciones serverless de GitHub.

const { Octokit } = require("@octokit/rest");

function createOctokit() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      "Falta la variable de entorno GITHUB_TOKEN. Añádela en Vercel o en tu entorno local."
    );
  }

  return new Octokit({
    auth: token,
    userAgent: "portafolio-personal-backend",
    request: {
      timeout: 10000
    }
  });
}

module.exports = {
  createOctokit
};

