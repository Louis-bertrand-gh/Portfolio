/**
 * projects-nav.js
 * ─────────────────────────────────────────────────────────────────
 * Gère dynamiquement les boutons « Projet précédent / suivant » :
 *  1. Corrige les href pour pointer vers des projets actifs
 *  2. Ajoute une popup de preview au hover des boutons
 *
 * Inclure APRÈS projects-data.js dans chaque page /projects/*.html
 * ─────────────────────────────────────────────────────────────────
 */

(() => {
  "use strict";

  if (typeof PROJECTS_LIST === "undefined" || !PROJECTS_LIST.length) return;

  const actions = document.querySelector(".project-footer-actions");
  if (!actions) return;

  /* ── Bouton suivant existant (ou fallback premier outline) ── */
  let nextBtn = actions.querySelector(".btn-project-next");
  if (!nextBtn) {
    nextBtn = actions.querySelector(".btn-project.btn-project-outline[href]");
    if (nextBtn) nextBtn.classList.add("btn-project-next");
  }

  if (!nextBtn) return;

  /* ── Bouton précédent injecté automatiquement ── */
  let prevBtn = actions.querySelector(".btn-project-prev");
  if (!prevBtn) {
    prevBtn = document.createElement("a");
    prevBtn.href = "#";
    prevBtn.className = "btn-project btn-project-outline btn-project-prev";
    prevBtn.textContent = "← Projet precedent";
    actions.insertBefore(prevBtn, nextBtn);
  }

  /* ── Déterminer la page courante ── */
  const currentFile = window.location.pathname.split("/").pop();

  /* ── Trouver l'index courant dans PROJECTS_LIST ── */
  const currentIdx = PROJECTS_LIST.findIndex((p) =>
    p.link.endsWith(currentFile),
  );

  /* Si la page courante n'est pas dans la liste active → cacher les boutons */
  if (currentIdx === -1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }

  /* ── Projet précédent (boucle circulaire) ── */
  const prevIdx =
    (currentIdx - 1 + PROJECTS_LIST.length) % PROJECTS_LIST.length;
  const prev = PROJECTS_LIST[prevIdx];

  /* ── Projet suivant (boucle circulaire) ── */
  const nextIdx = (currentIdx + 1) % PROJECTS_LIST.length;
  const next = PROJECTS_LIST[nextIdx];

  const setButtonLink = (button, project) => {
    if (project.link.startsWith("http")) {
      button.href = project.link;
      button.target = "_blank";
      button.rel = "noopener";
    } else {
      button.href = project.link.replace(/^projects\//, "");
      button.removeAttribute("target");
      button.removeAttribute("rel");
    }
  };

  const getImageSrc = (project) => {
    let imgSrc = project.image;
    if (!imgSrc.startsWith("http") && !imgSrc.startsWith("/")) {
      imgSrc = "../../" + imgSrc;
    } else if (imgSrc.startsWith("/")) {
      imgSrc = "../.." + imgSrc;
    }
    return imgSrc;
  };

  const createPreview = (button, project, label) => {
    const existingPreview = button.nextElementSibling;
    if (existingPreview && existingPreview.classList.contains("next-preview")) {
      existingPreview.remove();
    }

    const imgSrc = getImageSrc(project);
    const preview = document.createElement("div");
    preview.className = "next-preview";
    preview.innerHTML =
      '<div class="next-preview-img" style="background-image:url(\'' +
      imgSrc +
      "'); background-size:" +
      (project.zoom || 100) +
      '%"></div>' +
      '<div class="next-preview-body">' +
      '<span class="next-preview-label">' +
      label +
      "</span>" +
      '<h4 class="next-preview-title">' +
      project.title +
      "</h4>" +
      '<p class="next-preview-desc">' +
      project.desc +
      "</p>" +
      '<div class="next-preview-tags">' +
      project.tech
        .map(function (t) {
          return '<span class="next-preview-tag">' + t + "</span>";
        })
        .join("") +
      "</div>" +
      "</div>";

    button.insertAdjacentElement("afterend", preview);
  };

  /* ── Position relative sur le wrapper ── */
  const wrapper = actions;
  wrapper.style.position = "relative";

  setButtonLink(prevBtn, prev);
  setButtonLink(nextBtn, next);

  prevBtn.textContent = "← Projet precedent";
  nextBtn.textContent = "Projet suivant →";

  createPreview(prevBtn, prev, "Projet precedent");
  createPreview(nextBtn, next, "Projet suivant");
})();
