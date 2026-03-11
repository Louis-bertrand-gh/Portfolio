/**
 * projects-nav.js
 * ─────────────────────────────────────────────────────────────────
 * Gère dynamiquement le bouton « Projet suivant » :
 *  1. Corrige le href pour pointer vers un projet actif
 *  2. Ajoute une popup de preview au hover du bouton
 *
 * Inclure APRÈS projects-data.js dans chaque page /projects/*.html
 * ─────────────────────────────────────────────────────────────────
 */

(() => {
  "use strict";

  if (typeof PROJECTS_LIST === "undefined" || !PROJECTS_LIST.length) return;

  /* ── Trouver le bouton "Projet suivant" ── */
  const btn = document.querySelector(".btn-project.btn-project-outline[href]");
  if (!btn) return;

  /* ── Déterminer la page courante ── */
  const currentFile = window.location.pathname.split("/").pop();

  /* ── Trouver l'index courant dans PROJECTS_LIST ── */
  const currentIdx = PROJECTS_LIST.findIndex((p) =>
    p.link.endsWith(currentFile),
  );

  /* Si la page courante n'est pas dans la liste active → cacher le bouton */
  if (currentIdx === -1) {
    btn.style.display = "none";
    return;
  }

  /* ── Projet suivant (boucle circulaire) ── */
  const nextIdx = (currentIdx + 1) % PROJECTS_LIST.length;
  const next = PROJECTS_LIST[nextIdx];

  /* ── Corriger le href ── */
  if (next.link.startsWith("http")) {
    btn.href = next.link;
    btn.target = "_blank";
    btn.rel = "noopener";
  } else {
    /* link = "projects/xxx.html" → depuis /projects/, on veut "xxx.html" */
    btn.href = next.link.replace(/^projects\//, "");
  }

  /* ── Calculer le chemin image depuis html/projects/ ── */
  let imgSrc = next.image;
  if (!imgSrc.startsWith("http") && !imgSrc.startsWith("/")) {
    imgSrc = "../../" + imgSrc;
  } else if (imgSrc.startsWith("/")) {
    imgSrc = "../.." + imgSrc;
  }

  /* ── Construire la preview popup ── */
  /* ── Position relative sur le wrapper ── */
  const wrapper = btn.parentElement;
  wrapper.style.position = "relative";

  const preview = document.createElement("div");
  preview.className = "next-preview";
  preview.innerHTML =
    '<div class="next-preview-img" style="background-image:url(\'' +
    imgSrc +
    "'); background-size:" +
    (next.zoom || 100) +
    '%"></div>' +
    '<div class="next-preview-body">' +
    '<span class="next-preview-label">Projet suivant</span>' +
    '<h4 class="next-preview-title">' +
    next.title +
    "</h4>" +
    '<p class="next-preview-desc">' +
    next.desc +
    "</p>" +
    '<div class="next-preview-tags">' +
    next.tech
      .map(function (t) {
        return '<span class="next-preview-tag">' + t + "</span>";
      })
      .join("") +
    "</div>" +
    "</div>";

  /* Insérer juste après le bouton pour que le sélecteur CSS ~ fonctionne */
  btn.insertAdjacentElement("afterend", preview);
})();
