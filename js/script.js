/**
 * script.js
 * ─────────────────────────────────────────────────────────────────
 * Animation "post-it qui se décolle" sur les cards projet.
 *
 * Technique GPU :
 *  - will-change: transform, box-shadow, opacity → couche composite
 *  - Seuls transform et opacity sont animés → 0 reflow, 60fps garanti
 *  - requestAnimationFrame pour la navigation différée
 *
 * Compatible : Desktop (clic souris) + Mobile (tap tactile)
 * Aucune librairie externe.
 * ─────────────────────────────────────────────────────────────────
 */

(() => {
  "use strict";

  /* ════════════════════════════════════════════════════════════════
     CONSTANTES
  ════════════════════════════════════════════════════════════════ */
  const PEEL_DURATION = 380; // ms — durée de l'animation post-it
  const OVERLAY_DELAY = 260; // ms — le fond commence à s'estomper
  const NAV_DELAY = PEEL_DURATION + 80; // ms — navigation après animation

  /* ════════════════════════════════════════════════════════════════
     OVERLAY DE TRANSITION
     Un div semi-transparent qui "recouvre" la page avant navigation.
     Créé une seule fois et réutilisé.
  ════════════════════════════════════════════════════════════════ */

  let overlay = document.getElementById("card-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "card-overlay";
    document.body.appendChild(overlay);
  }

  /* ════════════════════════════════════════════════════════════════
     INITIALISATION DES CARDS
     Appelée après que portfolio.js ait construit le DOM,
     via l'événement custom 'cards:ready'
  ════════════════════════════════════════════════════════════════ */

  const initCards = () => {
    const cards = document.querySelectorAll(".project-card[data-href]");

    cards.forEach((card) => {
      /* ── Prépare le GPU dès le chargement ── */
      card.style.willChange = "transform, box-shadow, opacity";

      /* ── Clic / tap ── */
      card.addEventListener("click", onCardClick);

      /* ── Prévient le comportement natif de sélection de texte au clic ── */
      card.addEventListener("mousedown", (e) => e.preventDefault());
    });
  };

  /* ════════════════════════════════════════════════════════════════
     HANDLER : CLIC SUR UNE CARD
  ════════════════════════════════════════════════════════════════ */

  const onCardClick = function (e) {
    e.preventDefault();

    const card = this;
    const href = card.dataset.href;

    /* Évite un double-clic pendant l'animation */
    if (card.classList.contains("is-peeling")) return;
    if (!href || href === "#") return;

    /* ── Étape 1 : Décollage (classe CSS gère tout le transform) ── */
    card.classList.add("is-peeling");

    /* ── Étape 2 : Overlay s'assombrit légèrement ── */
    setTimeout(() => {
      overlay.classList.add("is-active");
    }, OVERLAY_DELAY);

    /* ── Étape 3 : Navigation après l'animation ── */
    setTimeout(() => {
      window.location.href = href;
    }, NAV_DELAY);
  };

  /* ════════════════════════════════════════════════════════════════
     ÉCOUTE LES ÉVÉNEMENTS
     ─ Si index.html : attendre que les cards soient construites
     ─ Si page projet : rien à faire ici
  ════════════════════════════════════════════════════════════════ */

  /* Cas 1 : les cards existent déjà au chargement (pages statiques) */
  if (document.querySelectorAll(".project-card[data-href]").length > 0) {
    initCards();
  }

  /* Cas 2 : les cards sont construites dynamiquement par portfolio.js */
  document.addEventListener("cards:ready", initCards, { once: true });

  /* ════════════════════════════════════════════════════════════════
     SCROLL REVEAL pour les pages projet
     (IntersectionObserver sur .project-section)
  ════════════════════════════════════════════════════════════════ */

  const initProjectReveal = () => {
    const sections = document.querySelectorAll(".project-section");
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (!entry.isIntersecting) return;
          /* Délai en cascade pour chaque section */
          setTimeout(() => {
            entry.target.classList.add("in-view");
          }, idx * 80);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );

    sections.forEach((s) => io.observe(s));
  };

  /* Lance le reveal au chargement de la page */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectReveal);
  } else {
    initProjectReveal();
  }

  /* ════════════════════════════════════════════════════════════════
     ANIMATION D'ENTRÉE sur les pages projet
     Fade-in depuis le bas au chargement
  ════════════════════════════════════════════════════════════════ */

  const hero = document.querySelector(".project-hero-inner");
  if (hero) {
    hero.style.opacity = "0";
    hero.style.transform = "translateY(22px)";
    hero.style.transition = "opacity .6s ease, transform .6s ease";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hero.style.opacity = "1";
        hero.style.transform = "none";
      });
    });
  }
})();
