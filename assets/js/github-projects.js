(function () {
  'use strict';

  var WOWAvailable = typeof WOW !== 'undefined';
  var FALLBACK_LANGUAGE_NAME = 'Otros';

  function slugify(value) {
    return (value || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'sin-categoria';
  }

  function formatRelativeTime(dateString) {
    if (!dateString) {
      return '';
    }

    try {
      var date = new Date(dateString);
      var now = new Date();
      var diff = Math.max(0, now - date);
      var seconds = Math.floor(diff / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);
      var months = Math.floor(days / 30);
      var years = Math.floor(days / 365);

      if (years > 0) {
        return 'Actualizado hace ' + years + (years === 1 ? ' año' : ' años');
      }
      if (months > 0) {
        return 'Actualizado hace ' + months + (months === 1 ? ' mes' : ' meses');
      }
      if (days > 0) {
        return 'Actualizado hace ' + days + (days === 1 ? ' día' : ' días');
      }
      if (hours > 0) {
        return 'Actualizado hace ' + hours + (hours === 1 ? ' hora' : ' horas');
      }
      if (minutes > 0) {
        return 'Actualizado hace ' + minutes + (minutes === 1 ? ' minuto' : ' minutos');
      }
      return 'Actualizado hace instantes';
    } catch (error) {
      return '';
    }
  }

  function renderStatus(statusElement, message, type) {
    if (!statusElement) {
      return;
    }

    statusElement.textContent = message;
    statusElement.classList.remove('portfolio-status--hidden', 'portfolio-status--error');

    if (type === 'error') {
      statusElement.classList.add('portfolio-status--error');
    }
  }

  function hideStatus(statusElement) {
    if (!statusElement) {
      return;
    }

    statusElement.classList.add('portfolio-status--hidden');
  }

  function parseListAttribute(value) {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map(function (item) {
        return item.trim();
      })
      .filter(function (item) {
        return item.length > 0;
      });
  }

  function normalizeListInput(value) {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value
        .map(function (item) {
          return (item || '').toString().trim();
        })
        .filter(function (item) {
          return item.length > 0;
        });
    }

    if (typeof value === 'string') {
      return parseListAttribute(value);
    }

    return [];
  }

  function mergeUniqueLists(primary, secondary) {
    var seen = new Set();
    var result = [];

    function addItems(items) {
      (items || []).forEach(function (item) {
        if (!item) {
          return;
        }

        var normalized = item.toString().trim();
        if (!normalized) {
          return;
        }
        var key = normalized.toLowerCase();

        if (seen.has(key)) {
          return;
        }

        seen.add(key);
        result.push(normalized);
      });
    }

    addItems(primary);
    addItems(secondary);

    return result;
  }

  function resolveConfigList(attributeList, configList) {
    var attr = Array.isArray(attributeList) ? attributeList : [];
    var config = normalizeListInput(configList);

    if (!attr.length && config.length) {
      return config;
    }

    if (!config.length) {
      return attr;
    }

    return mergeUniqueLists(attr, config);
  }

  function normalizeRepoFullName(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function createBadge(text, className) {
    var badge = document.createElement('span');
    badge.className = className;
    badge.textContent = text;
    return badge;
  }

  function createProjectCard(repo) {
    var languageName = repo.language && repo.language.trim()
      ? repo.language.trim()
      : FALLBACK_LANGUAGE_NAME;
    var languageSlug = slugify(languageName);
    var topics = Array.isArray(repo.topics) ? repo.topics : [];
    var item = document.createElement('div');
    item.className = [
      'grid-item',
      'wow',
      'zoomIn',
      'lang-' + languageSlug
    ]
      .concat(
        topics.map(function (topic) {
          return 'topic-' + slugify(topic);
        })
      )
      .join(' ');

    var previewImageUrl = '';
    if (repo.owner && repo.owner.login && repo.name) {
      previewImageUrl =
        'https://opengraph.githubassets.com/1/' +
        encodeURIComponent(repo.owner.login) +
        '/' +
        encodeURIComponent(repo.name);
    }

    var fallbackImageUrl = 'https://via.placeholder.com/800x450.png?text=Vista+previa';

    var card = document.createElement('div');
    card.className = 'card portfolio-card h-100 shadow-sm';

    var imageWrapper = document.createElement('div');
    imageWrapper.className = 'portfolio-card-img';

    var image = document.createElement('img');
    image.className = 'portfolio-card-img-tag';
    image.loading = 'lazy';
    image.alt = 'Vista previa del proyecto ' + (repo.name || '');
    image.src = previewImageUrl || fallbackImageUrl;
    image.onerror = function () {
      if (this.dataset.fallbackApplied === 'true') {
        return;
      }
      this.dataset.fallbackApplied = 'true';
      this.src = fallbackImageUrl;
    };

    imageWrapper.appendChild(image);

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';

    var titleLink = document.createElement('a');
    titleLink.className = 'portfolio-card-title fg-theme';
    titleLink.href = repo.html_url;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener';
    titleLink.textContent = repo.name;

    var title = document.createElement('h5');
    title.className = 'card-title mb-2';
    title.appendChild(titleLink);

    var metaWrapper = document.createElement('div');
    metaWrapper.className = 'portfolio-card-meta';

    if (languageName) {
      var languageBadge = createBadge(languageName, 'badge badge-light portfolio-card-language');
      metaWrapper.appendChild(languageBadge);
    }

    if (repo.stargazers_count > 0) {
      var starBadge = createBadge('★ ' + repo.stargazers_count, 'badge badge-subhead portfolio-card-star');
      metaWrapper.appendChild(starBadge);
    }

    if (repo.forks_count > 0) {
      var forkBadge = createBadge('⑂ ' + repo.forks_count, 'badge badge-subhead portfolio-card-fork');
      metaWrapper.appendChild(forkBadge);
    }

    if (!metaWrapper.children.length) {
      var placeholderBadge = createBadge('Otros', 'badge badge-light portfolio-card-placeholder');
      metaWrapper.appendChild(placeholderBadge);
    }

    var updatedAt = document.createElement('small');
    updatedAt.className = 'd-block text-muted mt-2';
    updatedAt.textContent = formatRelativeTime(repo.pushed_at);

    card.appendChild(imageWrapper);

    cardBody.appendChild(title);
    cardBody.appendChild(metaWrapper);

    if (updatedAt.textContent) {
      cardBody.appendChild(updatedAt);
    }

    card.appendChild(cardBody);
    item.appendChild(card);

    return item;
  }

  function createSkillProgress(languageEntry, totalRepos) {
    var percent = totalRepos ? Math.round((languageEntry.count / totalRepos) * 100) : 0;

    var wrapper = document.createElement('div');
    wrapper.className = 'progress-wrapper wow fadeInUp';

    var label = document.createElement('div');
    label.className = 'd-flex justify-content-between align-items-center mb-1';

    var caption = document.createElement('span');
    caption.className = 'caption';
    caption.textContent = languageEntry.name;

    var detail = document.createElement('span');
    detail.className = 'text-muted small';
    detail.textContent =
      languageEntry.count +
      ' proyecto' +
      (languageEntry.count === 1 ? '' : 's');

    label.appendChild(caption);
    label.appendChild(detail);

    var progress = document.createElement('div');
    progress.className = 'progress';

    var progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuenow', percent);
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.style.width = percent + '%';
    progressBar.textContent = percent + '%';

    progress.appendChild(progressBar);

    wrapper.appendChild(label);
    wrapper.appendChild(progress);

    return wrapper;
  }

  function updateSkills(languageStats, totalRepos) {
    var skillsContainer = document.getElementById('github-skills');

    if (!skillsContainer) {
      return;
    }

    if (!totalRepos || totalRepos <= 0) {
      skillsContainer.innerHTML =
        '<div class="col-12 text-center text-muted github-skills-status">No hay suficientes datos para mostrar habilidades.</div>';
      return;
    }

    var statusElement = skillsContainer.querySelector('.github-skills-status');
    if (statusElement) {
      statusElement.remove();
    }

    var entries = Object.keys(languageStats || {}).map(function (language) {
      var stats = languageStats[language] || {};
      return {
        name: language,
        count: stats.count || 0,
        stars: stats.stars || 0,
        forks: stats.forks || 0
      };
    }).filter(function (entry) {
      return entry.count > 0;
    });

    if (!entries.length) {
      skillsContainer.innerHTML =
        '<div class="col-12 text-center text-muted github-skills-status">Los repositorios no incluyen lenguajes detectables.</div>';
      return;
    }

    entries.sort(function (a, b) {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      if (b.stars !== a.stars) {
        return b.stars - a.stars;
      }

      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    });

    var limitAttr = skillsContainer.dataset.githubSkillLimit;
    var limit = parseLimit(limitAttr);
    if (!Number.isFinite(limit) || limit > entries.length) {
      limit = entries.length;
    }

    var limitedEntries = entries.slice(0, limit);

    skillsContainer.innerHTML = '';
    skillsContainer.classList.add('row', 'py-3');

    limitedEntries.forEach(function (entry) {
      var column = document.createElement('div');
      column.className = 'col-md-6 col-lg-4 px-lg-3';
      column.appendChild(createSkillProgress(entry, totalRepos));
      skillsContainer.appendChild(column);
    });
  }

  function updateFilterButtons(languages) {
    if (!languages.size) {
      return;
    }

    var filterContainer = document.querySelector('.filterable-button');
    if (!filterContainer) {
      return;
    }

    var existingLanguageButtons = filterContainer.querySelectorAll('[data-filter^=".lang-"]');
    existingLanguageButtons.forEach(function (button) {
      button.remove();
    });

    Array.from(languages)
      .sort(function (a, b) {
        return a.localeCompare(b, 'es', { sensitivity: 'base' });
      })
      .forEach(function (language) {
      var button = document.createElement('button');
      button.className = 'btn btn-theme-outline';
      button.setAttribute('data-filter', '.lang-' + slugify(language));
      button.textContent = language;
      filterContainer.appendChild(button);
    });
  }

  function parseLimit(rawLimit) {
    if (!rawLimit || rawLimit === 'all') {
      return Infinity;
    }

    var parsed = parseInt(rawLimit, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return 6;
    }

    return parsed;
  }

  function resolveLimit(datasetValue, configValue) {
    if (datasetValue && datasetValue.toString().trim().length) {
      return parseLimit(datasetValue);
    }

    if (
      typeof configValue === 'number' ||
      (typeof configValue === 'string' && configValue.toString().trim().length)
    ) {
      return parseLimit(configValue.toString());
    }

    return parseLimit(null);
  }

  function buildFetchHeaders(authToken) {
    var headers = {
      Accept: 'application/vnd.github+json'
    };

    if (authToken) {
      headers.Authorization = 'Bearer ' + authToken;
      headers['X-GitHub-Api-Version'] = '2022-11-28';
    }

    return headers;
  }

  function fetchGithubRepos(username, sort, limit, apiBaseUrl, authToken) {
    var perPage = 100;
    var accumulated = [];
    var page = 1;
    var remaining = limit;
    var baseUrl = (apiBaseUrl || 'https://api.github.com').replace(/\/+$/, '');

    function requestPage() {
      var currentPerPage = limit === Infinity ? perPage : Math.min(perPage, remaining);

      var apiUrl =
        baseUrl +
        '/users/' +
        encodeURIComponent(username) +
        '/repos?sort=' +
        encodeURIComponent(sort) +
        '&per_page=' +
        encodeURIComponent(currentPerPage) +
        '&page=' +
        encodeURIComponent(page);

      return fetch(apiUrl, {
        headers: buildFetchHeaders(authToken)
      }).then(function (response) {
        if (response.status === 404) {
          throw new Error('No se encontró el usuario de GitHub "' + username + '".');
        }

        if (response.status === 403) {
          throw new Error(
            'GitHub API alcanzó el límite de peticiones públicas. Inténtalo de nuevo en unos minutos.'
          );
        }

        if (!response.ok) {
          throw new Error('No se pudieron cargar los repositorios desde GitHub.');
        }

        return response.json();
      }).then(function (repos) {
        if (!Array.isArray(repos) || !repos.length) {
          return [];
        }

        accumulated = accumulated.concat(repos);

        if (limit !== Infinity) {
          remaining -= repos.length;
        }

        var shouldContinue =
          repos.length === currentPerPage &&
          (limit === Infinity || remaining > 0);

        if (shouldContinue) {
          page += 1;
          return requestPage();
        }

        return [];
      });
    }

    return requestPage().then(function () {
      return limit === Infinity ? accumulated : accumulated.slice(0, limit);
    });
  }

  function fetchAuthenticatedUser(apiBaseUrl, authToken) {
    if (!authToken) {
      return Promise.resolve(null);
    }

    var baseUrl = (apiBaseUrl || 'https://api.github.com').replace(/\/+$/, '');

    return fetch(baseUrl + '/user', {
      headers: buildFetchHeaders(authToken)
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('No se pudo obtener la información del usuario autenticado.');
        }
        return response.json();
      })
      .catch(function () {
        return null;
      });
  }

  function fetchAuthenticatedRepos(sort, limit, apiBaseUrl, authToken) {
    if (!authToken) {
      return Promise.resolve([]);
    }

    var perPage = 100;
    var accumulated = [];
    var page = 1;
    var remaining = limit;
    var baseUrl = (apiBaseUrl || 'https://api.github.com').replace(/\/+$/, '');

    function requestPage() {
      var currentPerPage = limit === Infinity ? perPage : Math.min(perPage, remaining);

      var apiUrl =
        baseUrl +
        '/user/repos?sort=' +
        encodeURIComponent(sort) +
        '&visibility=all&per_page=' +
        encodeURIComponent(currentPerPage) +
        '&page=' +
        encodeURIComponent(page);

      return fetch(apiUrl, {
        headers: buildFetchHeaders(authToken)
      }).then(function (response) {
        if (response.status === 401) {
          throw new Error('El token de GitHub no es válido o expiró.');
        }

        if (response.status === 403) {
          throw new Error(
            'GitHub API alcanzó el límite de peticiones públicas o el token no tiene permisos suficientes.'
          );
        }

        if (!response.ok) {
          throw new Error('No se pudieron cargar los repositorios privados de GitHub.');
        }

        return response.json();
      }).then(function (repos) {
        if (!Array.isArray(repos) || !repos.length) {
          return [];
        }

        accumulated = accumulated.concat(repos);

        if (limit !== Infinity) {
          remaining -= repos.length;
        }

        var shouldContinue =
          repos.length === currentPerPage &&
          (limit === Infinity || remaining > 0);

        if (shouldContinue) {
          page += 1;
          return requestPage();
        }

        return [];
      });
    }

    return requestPage().then(function () {
      return limit === Infinity ? accumulated : accumulated.slice(0, limit);
    });
  }

  function getStoredToken(storageKey) {
    var token = '';

    try {
      if (storageKey && typeof window !== 'undefined') {
        if (window.localStorage && window.localStorage.getItem(storageKey)) {
          token = window.localStorage.getItem(storageKey) || '';
        } else if (window.sessionStorage && window.sessionStorage.getItem(storageKey)) {
          token = window.sessionStorage.getItem(storageKey) || '';
        }
      }
    } catch (error) {
      token = '';
    }

    return token;
  }

  function resolveAuthToken(container) {
    if (!container) {
      return '';
    }

    var explicitToken =
      container.dataset.githubAuthToken ||
      document.body.dataset.githubAuthToken ||
      '';

    if (explicitToken) {
      return explicitToken;
    }

    var storageKey =
      container.dataset.githubAuthStorageKey ||
      document.body.dataset.githubAuthStorageKey ||
      'githubAuthToken';

    return getStoredToken(storageKey);
  }

  function loadRepositories(config) {
    var users = config.users || [];
    var sort = config.sort;
    var limit = config.limit;
    var apiBaseUrl = config.apiBaseUrl;
    var authToken = config.authToken;

    var originalUsersMap = new Map();
    users.forEach(function (user) {
      if (!user) {
        return;
      }
      originalUsersMap.set(user.toLowerCase(), user);
    });

    var normalizedUsers = Array.from(originalUsersMap.keys());

    return fetchAuthenticatedUser(apiBaseUrl, authToken).then(function (authUser) {
      var authLogin = authUser && authUser.login ? authUser.login : null;
      var authLoginLower = authLogin ? authLogin.toLowerCase() : null;

      if (!normalizedUsers.length && authLogin) {
        normalizedUsers.push(authLoginLower);
        if (!originalUsersMap.has(authLoginLower)) {
          originalUsersMap.set(authLoginLower, authLogin);
        }
      }

      var allowedOwners = normalizedUsers.length
        ? new Set(normalizedUsers)
        : authLoginLower
          ? new Set([authLoginLower])
          : null;

      var fetchPromises = [];

      if (authToken && authLogin) {
        fetchPromises.push(
          fetchAuthenticatedRepos(sort, limit, apiBaseUrl, authToken)
            .then(function (repos) {
              if (!Array.isArray(repos)) {
                return [];
              }

              return repos.filter(function (repo) {
                if (!repo || !repo.owner || !repo.owner.login) {
                  return false;
                }

                var ownerLower = repo.owner.login.toLowerCase();

                if (allowedOwners && allowedOwners.size) {
                  return allowedOwners.has(ownerLower);
                }

                return ownerLower === authLoginLower;
              });
            })
            .catch(function () {
              return [];
            })
        );

        if (authLoginLower) {
          originalUsersMap.delete(authLoginLower);
        }
      }

      originalUsersMap.forEach(function (originalUser, lowerUser) {
        fetchPromises.push(
          fetchGithubRepos(originalUser, sort, limit, apiBaseUrl, authToken)
            .catch(function () {
              return [];
            })
        );
      });

      if (!fetchPromises.length) {
        return Promise.reject(
          new Error('Configura al menos un usuario de GitHub válido o proporciona un token con acceso.')
        );
      }

      return Promise.all(fetchPromises).then(function (results) {
        return results.reduce(function (acc, repos) {
          if (Array.isArray(repos)) {
            return acc.concat(repos);
          }
          return acc;
        }, []);
      });
    });
  }

  function filterRepositories(repos, options) {
    if (!Array.isArray(repos)) {
      return [];
    }

    var includeSet = options.include;
    var excludeSet = options.exclude;
    var limit = options.limit;

    var seen = new Set();
    var filtered = [];

    repos.forEach(function (repo) {
      if (
        !repo ||
        !repo.owner ||
        !repo.owner.login ||
        !repo.name ||
        repo.archived ||
        repo.fork
      ) {
        return;
      }

      var identifier = normalizeRepoFullName(repo.full_name || (repo.owner.login + '/' + repo.name));

      if (seen.has(identifier)) {
        return;
      }

      if (includeSet.size && !includeSet.has(identifier)) {
        return;
      }

      if (excludeSet.has(identifier)) {
        return;
      }

      seen.add(identifier);
      filtered.push(repo);
    });

    filtered.sort(function (a, b) {
      var dateA = Date.parse(a.pushed_at || a.updated_at || a.created_at || 0);
      var dateB = Date.parse(b.pushed_at || b.updated_at || b.created_at || 0);
      return dateB - dateA;
    });

    if (Number.isFinite(limit) && limit > 0 && filtered.length > limit) {
      return filtered.slice(0, limit);
    }

    return filtered;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('github-projects');

    if (!container) {
      return;
    }

    var statusElement = document.getElementById('github-projects-status');
    var globalConfig = window.GITHUB_PROJECTS_CONFIG || {};

    var users = mergeUniqueLists(
      parseListAttribute(container.dataset.githubUsers),
      parseListAttribute(document.body.dataset.githubUsers)
    );

    var configUsers = normalizeListInput(globalConfig.users);
    if (!users.length && configUsers.length) {
      users = configUsers.slice();
    } else if (configUsers.length) {
      users = mergeUniqueLists(users, configUsers);
    }

    if (!users.length) {
      var fallbackUser =
        container.dataset.githubUser ||
        document.body.dataset.githubUser ||
        '';

      if (fallbackUser) {
        users = normalizeListInput(fallbackUser);
      }
    }

    if (!users.length && configUsers.length) {
      users = configUsers.slice();
    }

    var limit = resolveLimit(container.dataset.githubLimit, globalConfig.limit);
    var sort =
      (container.dataset.githubSort && container.dataset.githubSort.trim()) ||
      (typeof globalConfig.sort === 'string' && globalConfig.sort.trim()) ||
      'updated';
    var apiBaseUrl =
      (container.dataset.githubApiBase && container.dataset.githubApiBase.trim()) ||
      (typeof globalConfig.apiBaseUrl === 'string' && globalConfig.apiBaseUrl.trim()) ||
      'https://api.github.com';
    var includeList = resolveConfigList(
      parseListAttribute(container.dataset.githubInclude),
      globalConfig.include
    );
    var excludeList = resolveConfigList(
      parseListAttribute(container.dataset.githubExclude),
      globalConfig.exclude
    );
    var authToken = resolveAuthToken(container);

    if ((!users || !users.length) && !authToken) {
      renderStatus(
        statusElement,
        'Configura uno o más usuarios en data-github-users o proporciona un token para acceder a tus repositorios.',
        'error'
      );
      return;
    }

    var includeSet = new Set(includeList.map(normalizeRepoFullName));
    var excludeSet = new Set(excludeList.map(normalizeRepoFullName));

    renderStatus(statusElement, 'Cargando proyectos desde GitHub...');

    loadRepositories({
      users: users,
      sort: sort,
      limit: limit,
      apiBaseUrl: apiBaseUrl,
      authToken: authToken
    })
      .then(function (repos) {
        var filteredRepos = filterRepositories(repos, {
          include: includeSet,
          exclude: excludeSet,
          limit: limit
        });

        if (!filteredRepos.length) {
          renderStatus(
            statusElement,
            'No hay repositorios que cumplan con los criterios seleccionados.',
            'error'
          );
          return;
        }

        var fragment = document.createDocumentFragment();
    var languages = new Set();
    var languageStats = Object.create(null);

        filteredRepos.forEach(function (repo) {
        var languageName = repo.language && repo.language.trim() ? repo.language.trim() : FALLBACK_LANGUAGE_NAME;

        if (languageName) {
          languages.add(languageName);

          var stats = languageStats[languageName] || { count: 0, stars: 0, forks: 0 };
          stats.count += 1;
          stats.stars += repo.stargazers_count || 0;
          stats.forks += repo.forks_count || 0;
          languageStats[languageName] = stats;
        }

          fragment.appendChild(createProjectCard(repo));
        });

        hideStatus(statusElement);

        var $portfolioContainer = window.portfolioIsotopeContainer;
        if (
          $portfolioContainer &&
          typeof $portfolioContainer.empty === 'function' &&
          $portfolioContainer.length
        ) {
          $portfolioContainer.empty().append(fragment);
        } else {
          container.innerHTML = '';
          container.appendChild(fragment);
        }

        updateSkills(languageStats, filteredRepos.length);

        updateFilterButtons(languages);

        if (window.portfolioIsotope && typeof window.portfolioIsotope.isotope === 'function') {
          window.portfolioIsotope.isotope('reloadItems').isotope({ filter: '*' }).isotope('layout');
        }

        if (WOWAvailable) {
          new WOW().init();
        }

      })
      .catch(function (error) {
        renderStatus(statusElement, error.message || 'Ocurrió un error al cargar los proyectos.', 'error');
      });
  });
})();

