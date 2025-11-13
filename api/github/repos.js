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
    octokit = await createOctokit();
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
      archived: repo.archived,
      fork: repo.fork,
      owner: repo.owner
        ? {
            login: repo.owner.login,
            avatar_url: repo.owner.avatar_url,
            html_url: repo.owner.html_url
          }
        : null
    }));

    return res.status(200).json({
      count: simplified.length,
      repositories: simplified
    });
  } catch (error) {
    const status =
      error.status ||
      (error.response && error.response.status) ||
      500;

    console.error("Error al listar repositorios:", {
      status,
      message: error.message,
      response: error.response && error.response.data
    });

    return res.status(status).json({
      error:
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "No se pudo recuperar la lista de repositorios.",
      status,
      hint:
        status === 403
          ? "GitHub devolvió 403. Asegúrate de configurar un GITHUB_TOKEN válido en Vercel para aumentar el límite de peticiones."
          : undefined
    });
  }
};

