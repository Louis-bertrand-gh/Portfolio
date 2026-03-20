(() => {
  "use strict";

  const STORAGE_KEY = "portfolio-theme";
  const root = document.documentElement;

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
  };

  const updateButtonsLabel = (theme) => {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      const nextMode = theme === "dark" ? "Mode clair" : "Mode sombre";
      btn.textContent = nextMode;
      btn.setAttribute("aria-label", nextMode);
    });
  };

  const applyTheme = (theme, persist = true) => {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;

    if (persist) {
      localStorage.setItem(STORAGE_KEY, theme);
    }

    updateButtonsLabel(theme);
  };

  const toggleTheme = () => {
    const current =
      root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  };

  const createToggleButton = () => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.addEventListener("click", toggleTheme);
    return button;
  };

  const mountToggles = () => {
    const navbar = document.getElementById("navbar");
    if (navbar && !navbar.querySelector(".theme-toggle")) {
      navbar.appendChild(createToggleButton());
    }

    const projectNav = document.querySelector(".project-nav");
    if (projectNav && !projectNav.querySelector(".theme-toggle")) {
      projectNav.appendChild(createToggleButton());
    }

    if (!navbar && !projectNav && !document.querySelector(".theme-toggle")) {
      const floatingToggle = createToggleButton();
      floatingToggle.classList.add("theme-toggle-floating");
      document.body.appendChild(floatingToggle);
    }

    updateButtonsLabel(root.getAttribute("data-theme") || "light");
  };

  const init = () => {
    mountToggles();
  };

  // Apply as early as possible to reduce light/dark flash on page load.
  applyTheme(getPreferredTheme(), false);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.addEventListener("storage", (event) => {
    if (
      event.key === STORAGE_KEY &&
      (event.newValue === "light" || event.newValue === "dark")
    ) {
      applyTheme(event.newValue, false);
    }
  });
})();
