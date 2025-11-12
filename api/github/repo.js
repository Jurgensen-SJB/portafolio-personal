"use strict";

const { createOctokit } = require("../../lib/githubClient");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { owner = process.env.GITHUB_USERNAME, repo } = req.query;

  if (!owner || !repo) {
    return res
      .status(400)
      .json({ error: "Debes proporcionar los parámetros owner y repo." });
  }

  let octokit;

  try {
    octokit = createOctokit();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    const response = await octokit.rest.repos.get({
      owner,
      repo,
      mediaType: {
        previews: ["mercy"]
      }
    });

    const data = response.data;

    const result = {
      id: data.id,
      name: data.name,
      full_name: data.full_name,
      description: data.description,
      html_url: data.html_url,
      homepage: data.homepage,
      default_branch: data.default_branch,
      language: data.language,
      topics: data.topics,
      stargazers_count: data.stargazers_count,
      watchers_count: data.watchers_count,
      forks_count: data.forks_count,
      open_issues_count: data.open_issues_count,
      license: data.license ? data.license.spdx_id : null,
      archived: data.archived,
      disabled: data.disabled,
      created_at: data.created_at,
      updated_at: data.updated_at,
      pushed_at: data.pushed_at
    };

    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: "No se pudo recuperar la información del repositorio.",
      details: error.message
    });
  }
};

