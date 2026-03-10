/**
 * portfolio.js
 * Gère le contenu du portfolio après l'ouverture de l'intro.
 *
 * Responsabilités :
 *  - Construire le DOM à partir de l'objet DATA (défini dans index.html)
 *  - Scroll reveal (IntersectionObserver) pour timeline et projets
 *  - Barre de langues animée
 *  - Navigation sticky
 */

(() => {
  'use strict';

  /* ════════════════════════════════════════════════
     CONSTRUCTION DU DOM
  ════════════════════════════════════════════════ */

  const buildDOM = () => {
    /* ── Compétences ── */
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid && DATA.skills) {
      DATA.skills.forEach(s => {
        const items = s.items.map(i => `<li>${i}</li>`).join('');
        skillsGrid.insertAdjacentHTML('beforeend', `
          <div class="skill-card">
            <div class="skill-icon">${s.icon}</div>
            <div class="skill-cat">${s.category}</div>
            <ul class="skill-items">${items}</ul>
          </div>`);
      });
    }

    /* ── Formation ── */
    const eduTimeline = document.getElementById('edu-timeline');
    if (eduTimeline && DATA.education) {
      DATA.education.forEach(e => {
        eduTimeline.insertAdjacentHTML('beforeend', `
          <div class="timeline-item">
            <div class="timeline-period">${e.period}</div>
            <div class="timeline-title">${e.title}</div>
            <div class="timeline-sub">${e.option}</div>
            <div class="timeline-school">${e.school}</div>
          </div>`);
      });
    }

    /* ── Expériences ── */
    const expTimeline = document.getElementById('exp-timeline');
    if (expTimeline && DATA.experiences) {
      DATA.experiences.forEach(e => {
        const tasks = e.tasks.map(t => `<li>${t}</li>`).join('');
        expTimeline.insertAdjacentHTML('beforeend', `
          <div class="timeline-item">
            <div class="timeline-period">${e.period}</div>
            <div class="timeline-title">${e.role}</div>
            <div class="timeline-school">${e.company}</div>
            <ul class="timeline-tasks">${tasks}</ul>
          </div>`);
      });
    }

    /* ── Projets ── */
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid && DATA.projects) {
      DATA.projects.forEach(p => {
        const tags = p.tech.map(t => `<span class="tag">${t}</span>`).join('');
        projectsGrid.insertAdjacentHTML('beforeend', `
          <div class="project-card">
            <div class="project-title">${p.title}</div>
            <p class="project-desc">${p.desc}</p>
            <div class="tag-row">${tags}</div>
            <a href="${p.link}" target="_blank" rel="noopener" class="project-link">Voir le projet →</a>
          </div>`);
      });
    }

    /* ── Qualités ── */
    const qualityList = document.getElementById('quality-list');
    if (qualityList && DATA.qualities) {
      DATA.qualities.forEach(q => {
        qualityList.insertAdjacentHTML('beforeend',
          `<span class="quality-chip">${q}</span>`);
      });
    }

    /* ── Langues ── */
    const langList = document.getElementById('lang-list');
    if (langList && DATA.languages) {
      DATA.languages.forEach(l => {
        langList.insertAdjacentHTML('beforeend', `
          <div class="lang-item">
            <div class="lang-name"><span>${l.lang}</span><span>${l.level}</span></div>
            <div class="lang-bar">
              <div class="lang-fill" data-pct="${l.pct}"></div>
            </div>
          </div>`);
      });
    }

    /* ── Centres d'intérêt ── */
    const interestList = document.getElementById('interest-list');
    if (interestList && DATA.interests) {
      DATA.interests.forEach(i => {
        interestList.insertAdjacentHTML('beforeend',
          `<span class="interest-chip">${i}</span>`);
      });
    }

    /* ── Contact liens ── */
    const contactLinks = document.getElementById('contact-links');
    if (contactLinks && DATA) {
      const links = [
        { label: `✉️ ${DATA.email}`,  href: `mailto:${DATA.email}` },
        { label: '⚡ GitHub',          href: DATA.github },
        { label: '💼 LinkedIn',        href: DATA.linkedin },
      ];
      links.forEach(l => {
        contactLinks.insertAdjacentHTML('beforeend',
          `<a href="${l.href}" target="_blank" rel="noopener" class="btn btn-primary">${l.label}</a>`);
      });
    }

    /* ── Footer ── */
    const footer = document.getElementById('site-footer');
    if (footer) footer.textContent = `© ${new Date().getFullYear()} ${DATA.name} · Tous droits réservés`;
  };

  /* ════════════════════════════════════════════════
     SCROLL REVEAL (IntersectionObserver)
  ════════════════════════════════════════════════ */

  const initReveal = () => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          /* Délai en cascade basé sur l'index de l'élément dans son parent */
          const siblings = [...entry.target.parentElement.children];
          const idx      = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.timeline-item, .project-card').forEach(el => io.observe(el));
  };

  /* ════════════════════════════════════════════════
     BARRES DE LANGUES ANIMÉES
  ════════════════════════════════════════════════ */

  const initLangBars = () => {
    const strip = document.getElementById('about-strip');
    if (!strip) return;

    const langIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.lang-fill').forEach(bar => {
            // Délai léger pour que l'animation soit perçue
            setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 200);
          });
          langIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    langIO.observe(strip);
  };

  /* ════════════════════════════════════════════════
     NAVIGATION STICKY
  ════════════════════════════════════════════════ */

  const initNav = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('nav-visible', window.scrollY > 60);
    }, { passive: true });
  };

  /* ════════════════════════════════════════════════
     INITIALISATION — après l'ouverture de l'intro
  ════════════════════════════════════════════════ */

  const init = () => {
    buildDOM();
    initReveal();
    initLangBars();
    initNav();
  };

  /* Écoute l'événement émis par intro.js */
  document.addEventListener('intro:opened', init, { once: true });

})();
