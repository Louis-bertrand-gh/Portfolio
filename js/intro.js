/**
 * intro.js
 * Gère toute la logique du panneau d'introduction glissant.
 *
 * Responsabilités :
 *  - Bloquer le scroll au démarrage
 *  - Écouter les événements souris ET touch sur le panneau
 *  - Déplacer le panneau en suivant le pointeur (translateX)
 *  - Déclencher l'animation d'ouverture au-delà du seuil
 *  - Émettre l'événement custom "intro:opened" pour le reste du site
 */

(() => {
  "use strict";

  /* ── Références DOM ── */
  const intro = document.getElementById("intro");
  const panel = document.getElementById("intro-panel");
  const progress = document.getElementById("drag-progress");
  const flash = document.getElementById("open-flash");
  const hint = document.getElementById("drag-hint");

  if (!intro || !panel) return; // sécurité

  /* ── Configuration ── */
  const THRESHOLD = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--drag-threshold",
    ) || "0.40",
  );
  const OPEN_DURATION = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--open-duration",
    ) || "720",
  );

  /* ── État interne ── */
  let isDragging = false;
  let startX = 0; // position X au début du drag
  let currentDrag = 0; // déplacement courant en px (négatif = vers gauche)
  let panelWidth = 0; // largeur du panneau au moment du drag
  let opened = false; // verrou : une seule ouverture possible
  let rafId = null;

  /* ════════════════════════════════════════════════
     UTILITAIRES
  ════════════════════════════════════════════════ */

  /** Retourne la position X d'un événement souris ou touch */
  const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  /** Applique le translateX uniquement vers la gauche */
  const clampDrag = (px) => Math.min(0, Math.max(-panelWidth, px));

  /** Met à jour la barre de progression */
  const updateProgress = (ratio) => {
    if (progress) progress.style.width = `${Math.min(ratio * 100, 100)}%`;
  };

  /** Met à jour l'ombre latérale dynamiquement selon la progression */
  const updateShadow = (ratio) => {
    const opacity = 0.3 - ratio * 0.2;
    panel.style.boxShadow = `${12 + ratio * 8}px 0 ${48 + ratio * 24}px rgba(0,0,0,${opacity.toFixed(2)})`;
  };

  /* ════════════════════════════════════════════════
     BOUCLE RAF — applique le transform
  ════════════════════════════════════════════════ */

  const applyTransform = () => {
    panel.style.transform = `translateX(${currentDrag}px)`;
    rafId = null;
  };

  const scheduleTransform = () => {
    if (!rafId) rafId = requestAnimationFrame(applyTransform);
  };

  /* ════════════════════════════════════════════════
     ANIMATION D'OUVERTURE
  ════════════════════════════════════════════════ */

  const openIntro = () => {
    if (opened) return;
    opened = true;

    // Stoppe le drag
    isDragging = false;
    panel.classList.remove("is-dragging", "past-threshold");
    panel.classList.add("is-opening");
    intro.classList.add("is-opening");

    // Flash de lumière
    if (flash) {
      flash.classList.add("flash-in");
      setTimeout(() => flash.classList.replace("flash-in", "flash-out"), 80);
    }

    // Cache l'indice de drag
    if (hint) hint.style.opacity = "0";
    if (progress) progress.style.width = "100%";

    // Après l'animation : nettoyer, réactiver le scroll, révéler le portfolio
    setTimeout(() => {
      // Supprime l'overlay intro du DOM (plus utile)
      intro.classList.add("is-gone");

      // Réactive le scroll
      document.documentElement.classList.remove("locked");

      // Affiche la nav
      document.getElementById("navbar")?.classList.add("nav-visible");

      // Révèle le contenu portfolio
      document.getElementById("portfolio")?.classList.add("is-revealed");

      // Émet l'événement pour portfolio.js
      document.dispatchEvent(new CustomEvent("intro:opened"));

      // Remet le flash transparent
      if (flash) flash.style.display = "none";
    }, OPEN_DURATION + 120);
  };

  /* ════════════════════════════════════════════════
     RETOUR ÉLASTIQUE (si l'utilisateur relâche avant le seuil)
  ════════════════════════════════════════════════ */

  const snapBack = () => {
    panel.classList.remove("is-dragging", "past-threshold");
    panel.style.transition =
      "transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 380ms ease";
    panel.style.transform = "translateX(0)";
    panel.style.boxShadow = "";
    if (progress) progress.style.width = "0%";

    // Retire la transition personnalisée après le snap
    setTimeout(() => {
      panel.style.transition = "";
    }, 400);
  };

  /* ════════════════════════════════════════════════
     HANDLERS SOURIS
  ════════════════════════════════════════════════ */

  const onMouseDown = (e) => {
    if (opened) return;
    isDragging = true;
    startX = getX(e);
    panelWidth = panel.getBoundingClientRect().width;

    panel.classList.add("is-dragging");
    panel.style.transition = "none";

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;

    const delta = clampDrag(getX(e) - startX);
    currentDrag = delta;
    const ratio = Math.abs(delta) / panelWidth;

    scheduleTransform();
    updateProgress(ratio);
    updateShadow(ratio);

    if (ratio >= THRESHOLD) {
      panel.classList.add("past-threshold");
    } else {
      panel.classList.remove("past-threshold");
    }
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    if (!isDragging) return;
    isDragging = false;

    const ratio = Math.abs(currentDrag) / panelWidth;
    if (ratio >= THRESHOLD) {
      openIntro();
    } else {
      snapBack();
    }
  };

  /* ════════════════════════════════════════════════
     HANDLERS TOUCH
  ════════════════════════════════════════════════ */

  const onTouchStart = (e) => {
    if (opened) return;
    isDragging = true;
    startX = getX(e);
    panelWidth = panel.getBoundingClientRect().width;

    panel.classList.add("is-dragging");
    panel.style.transition = "none";
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;

    const delta = clampDrag(getX(e) - startX);
    currentDrag = delta;
    const ratio = Math.abs(delta) / panelWidth;

    scheduleTransform();
    updateProgress(ratio);
    updateShadow(ratio);

    // Empêche le scroll natif pendant le drag horizontal
    if (Math.abs(delta) > 8) e.preventDefault();

    panel.classList.toggle("past-threshold", ratio >= THRESHOLD);
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    const ratio = Math.abs(currentDrag) / panelWidth;
    if (ratio >= THRESHOLD) {
      openIntro();
    } else {
      snapBack();
    }
  };

  /* ════════════════════════════════════════════════
     ATTACHE LES LISTENERS
  ════════════════════════════════════════════════ */

  panel.addEventListener("mousedown", onMouseDown);
  panel.addEventListener("touchstart", onTouchStart, { passive: true });
  panel.addEventListener("touchmove", onTouchMove, { passive: false });
  panel.addEventListener("touchend", onTouchEnd);
  panel.addEventListener("touchcancel", onTouchEnd);

  /* ── Prévient le drag natif des images / texte ── */
  panel.addEventListener("dragstart", (e) => e.preventDefault());

  /* ════════════════════════════════════════════════
     VERROU SCROLL INITIAL
  ════════════════════════════════════════════════ */

  document.documentElement.classList.add("locked");

  /* ── Raccourci clavier (accessibilité) : Entrée ou Espace ouvre l'intro ── */
  panel.setAttribute("tabindex", "0");
  panel.setAttribute("role", "button");
  panel.setAttribute("aria-label", "Tirer pour ouvrir le portfolio");
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openIntro();
    }
  });
})();
