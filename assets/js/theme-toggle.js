(function () {
  'use strict';

  var STORAGE_KEY = 'portfolioTheme';

  function initializeThemeToggle() {
    var toggleButton = document.querySelector('[data-theme-toggle]');
    var body = document.body;

    if (!toggleButton || !body) {
      return;
    }

    var icon = toggleButton.querySelector('.theme-toggle-icon');
    var prefersDark = false;

    try {
      prefersDark =
        window.matchMedia &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      prefersDark = false;
    }

    var storedTheme = null;

    try {
      storedTheme = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      storedTheme = null;
    }

    var currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
      body.classList.remove('light-mode', 'dark-mode');

      if (theme === 'dark') {
        body.classList.add('dark-mode');
        toggleButton.setAttribute('aria-label', 'Cambiar a modo claro');
        if (icon) {
          icon.textContent = '☀';
        }
      } else {
        body.classList.add('light-mode');
        toggleButton.setAttribute('aria-label', 'Cambiar a modo oscuro');
        if (icon) {
          icon.textContent = '🌙';
        }
      }
    }

    applyTheme(currentTheme);

    toggleButton.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);

      try {
        window.localStorage.setItem(STORAGE_KEY, currentTheme);
      } catch (error) {
        // Ignorar errores de almacenamiento
      }

      var themeChangeEvent;
      try {
        themeChangeEvent = new CustomEvent('themechange', { detail: { theme: currentTheme } });
      } catch (error) {
        themeChangeEvent = document.createEvent('CustomEvent');
        themeChangeEvent.initCustomEvent('themechange', false, false, { theme: currentTheme });
      }
      document.dispatchEvent(themeChangeEvent);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeToggle);
  } else {
    initializeThemeToggle();
  }
})();

