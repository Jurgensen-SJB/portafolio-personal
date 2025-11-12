"use strict";

const { createOctokit } = require("../../lib/githubClient");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    username = process.env.GITHUB_USERNAME,
    per_page = "6",
    sort = "updated",
    direction = "desc",
    include_forks = "false",
    topic
  } = req.query;

  if (!username) {
    return res
      .status(400)
      .json({ error: "Debes proporcionar el parámetro username o definir GITHUB_USERNAME." });
  }

  let octokit;

  try {
    octokit = createOctokit();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    const response = await octokit.rest.repos.listForUser({
      username,
      per_page: Number(per_page),
      sort,
      direction,
      mediaType: {
        previews: ["mercy"]
      }
    });

    let repositories = response.data.filter((repo) => !repo.private);

    if (include_forks !== "true") {
      repositories = repositories.filter((repo) => !repo.fork);
    }

    if (topic) {
      const topicLower = topic.toLowerCase();
      repositories = repositories.filter((repo) =>
        (repo.topics || []).some((t) => t.toLowerCase() === topicLower)
      );
    }

    const simplified = repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      homepage: repo.homepage,
      topics: repo.topics,
      stargazers_count: repo.stargazers_count,
      watchers_count: repo.watchers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      archived: repo.archived
    }));

    return res.status(200).json({
      count: simplified.length,
      repositories: simplified
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: "No se pudo recuperar la lista de repositorios.",
      details: error.message
    });
  }
};

