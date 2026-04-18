/* ===========================================
   Sreehari — Portfolio
   Phase 1 polish: cursor, progress, theme,
   projects (expandable case studies),
   skills matrix, reveals, scroll-spy.
   =========================================== */

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* ========== Data ========== */

  const projects = [
    {
      num: '01',
      slug: 'case_study_01.md',
      title: 'Enterprise Knowledge Assistant',
      status: { label: 'In Progress', cls: 'in-progress' },
      description:
        'Source-grounded AI backend for ingesting technical documents and answering questions with citations.',
      stack: ['FastAPI', 'LangChain', 'PostgreSQL', 'pgvector', 'RAG', 'Docker'],
      problem:
        'Teams lose hours hunting through technical docs. Generic chat models hallucinate without citations and can’t be trusted for internal knowledge.',
      approach:
        'FastAPI service with a pluggable retrieval layer: chunking, embeddings, pgvector search, and reranking. Structured responses carry inline source citations.',
      proves:
        'API design, retrieval architecture, source-grounded responses, backend structure.',
      links: { github: '#', demo: '#' },
    },
    {
      num: '02',
      slug: 'case_study_02.md',
      title: 'Support Ops Copilot',
      status: { label: 'Planned', cls: 'planned' },
      description:
        'AI backend for classifying support tickets, retrieving relevant context, drafting responses, and escalating uncertain cases.',
      stack: ['FastAPI', 'LangChain', 'PostgreSQL', 'Structured outputs'],
      problem:
        'Support teams repeat the same triage and answers daily, while edge cases quietly get worse responses than they deserve.',
      approach:
        'Pipeline: intent classification → retrieval → structured draft → confidence gate. Low-confidence tickets route to humans with ranked context.',
      proves:
        'Business workflow automation, structured AI outputs, routing logic.',
      links: { github: '#', demo: '#' },
    },
    {
      num: '03',
      slug: 'case_study_03.md',
      title: 'SQL Analyst Agent',
      status: { label: 'Planned', cls: 'planned' },
      description:
        'Tool-using AI system for converting natural-language analytics questions into safe SQL queries and summarized results.',
      stack: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'LangChain / LangGraph'],
      problem:
        'Non-technical stakeholders ask data questions that bottleneck analysts. Naïve text-to-SQL is unsafe and often wrong on real schemas.',
      approach:
        'Agent with a constrained tool set: schema inspector, query validator, read-only executor. Queries are type-checked and row-limited before running.',
      proves:
        'Tool use, database reasoning, safe query design, AI-assisted analytics.',
      links: { github: '#', demo: '#' },
    },
  ];

  const skills = [
    {
      num: '01',
      cat: 'backend',
      name: 'Backend',
      items: [{ name: 'Python' }, { name: 'FastAPI' }, { name: 'Pydantic' }, { name: 'SQLAlchemy' }, { name: 'REST APIs' }],
      level: 0.78,
      levelLabel: 'Working',
    },
    {
      num: '02',
      cat: 'db',
      name: 'Databases',
      items: [{ name: 'PostgreSQL' }, { name: 'SQL' }, { name: 'Relational modeling' }, { name: 'pgvector', note: 'basics' }],
      level: 0.66,
      levelLabel: 'Working',
    },
    {
      num: '03',
      cat: 'ai',
      name: 'AI Engineering',
      items: [{ name: 'LangChain' }, { name: 'RAG' }, { name: 'LlamaIndex', note: 'basics' }, { name: 'Embeddings' }, { name: 'Retrieval' }, { name: 'Structured outputs' }],
      level: 0.72,
      levelLabel: 'Working',
    },
    {
      num: '04',
      cat: 'prod',
      name: 'Production / Tooling',
      items: [{ name: 'Docker' }, { name: 'pytest' }, { name: 'Logging' }, { name: 'Git / GitHub' }, { name: 'Env configuration' }, { name: 'API design' }],
      level: 0.60,
      levelLabel: 'Familiar',
    },
  ];

  /* ========== Render: Projects (expandable case studies) ========== */

  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.innerHTML = projects.map((p) => `
      <article class="project reveal" data-cursor="expand" data-label="Expand" tabindex="0" aria-expanded="false" aria-label="${p.title}">
        <div class="project-slug">// ${p.slug} <span class="arrow">›</span></div>
        <header class="project-head">
          <div class="project-title-row">
            <span class="project-num">${p.num}</span>
            <h3>${p.title}</h3>
          </div>
          <span class="status ${p.status.cls}">
            <span class="s-dot"></span>${p.status.label}
          </span>
          <button class="project-toggle" type="button" aria-label="Toggle details" data-cursor="button">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </header>
        <p class="project-desc">${p.description}</p>

        <div class="project-body" role="region">
          <div class="project-case">
            <div class="project-case-block">
              <h4>Problem</h4>
              <p>${p.problem}</p>
            </div>
            <div class="project-case-block">
              <h4>Approach</h4>
              <p>${p.approach}</p>
            </div>
            <div class="project-case-block">
              <h4>Proves</h4>
              <p>${p.proves}</p>
            </div>
            <div class="project-case-block">
              <h4>Status</h4>
              <p>${p.status.label}${p.status.cls === 'in-progress' ? ' — shipping scope in progress.' : ' — scoped, not yet started.'}</p>
            </div>
          </div>

          <ul class="project-stack" aria-label="Stack">
            ${p.stack.map((s) => `<li class="stack-tag">${s}</li>`).join('')}
          </ul>

          <div class="project-links">
            <a class="project-link" href="${p.links.github}" data-link="github" data-cursor="link">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.93c.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.97.1-.76.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.72 0-1.27.45-2.3 1.19-3.11-.12-.3-.52-1.48.11-3.08 0 0 .97-.31 3.19 1.19.92-.26 1.91-.39 2.9-.39s1.98.13 2.9.39c2.22-1.5 3.18-1.19 3.18-1.19.64 1.6.24 2.78.12 3.08.74.81 1.18 1.84 1.18 3.11 0 4.45-2.69 5.42-5.26 5.71.41.35.78 1.04.78 2.1v3.11c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>
              GitHub
            </a>
            <a class="project-link" href="${p.links.demo}" data-link="demo" data-cursor="link">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
              Demo
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }

  /* ---- Project expand/collapse ---- */
  const onProjectToggle = (card) => {
    const open = card.classList.toggle('is-open');
    card.setAttribute('aria-expanded', open ? 'true' : 'false');
    card.dataset.label = open ? 'Collapse' : 'Expand';
    // Update custom cursor label if present
    if (cursor && cursor.el.classList.contains('has-label')) {
      cursor.label.textContent = card.dataset.label;
    }
  };

  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.project');
      if (!card) return;
      // Don't toggle when clicking internal links
      if (e.target.closest('a.project-link')) return;
      onProjectToggle(card);
    });
    grid.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.project');
      if (!card || e.target.closest('a.project-link')) return;
      e.preventDefault();
      onProjectToggle(card);
    });
  }

  /* ========== Render: Skills matrix ========== */

  const matrix = document.getElementById('skills-matrix');
  if (matrix) {
    matrix.innerHTML = skills.map((s) => `
      <div class="skill-row reveal" data-cat="${s.cat}">
        <div class="skill-head">
          <span class="skill-num">/${s.num}</span>
          <span class="skill-name">${s.name}</span>
        </div>
        <div class="skill-items">
          ${s.items.map((i) => `
            <span class="item">${i.name}${i.note ? ` <span class="item-note">${i.note}</span>` : ''}</span>
          `).join('')}
        </div>
        <div class="skill-level" aria-label="Proficiency">
          <div class="skill-bar"><div class="skill-bar-fill" data-level="${s.level}"></div></div>
          <span class="skill-level-label">${s.levelLabel}</span>
        </div>
      </div>
    `).join('');
  }

  /* ========== Scroll progress ========== */

  const progress = document.querySelector('.scroll-progress');
  const updateProgress = () => {
    const h = document.documentElement;
    const scrollTop = h.scrollTop || document.body.scrollTop;
    const scrollHeight = h.scrollHeight - h.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  };

  /* ========== Ambient spotlight ========== */

  const spotlight = document.querySelector('.spotlight');
  let mouseRaf = null;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 3;

  /* ========== Custom cursor ========== */

  let cursor = null;
  if (!prefersReducedMotion && hasFinePointer) {
    const el = document.querySelector('.cursor');
    const dot = el.querySelector('.cursor-dot');
    const ring = el.querySelector('.cursor-ring');
    const label = el.querySelector('.cursor-label');
    cursor = { el, dot, ring, label };

    document.documentElement.classList.add('has-cursor');

    let dx = mouseX, dy = mouseY;
    let rx = mouseX, ry = mouseY;

    const tick = () => {
      // Dot follows instantly, ring lags (spring-like smoothing)
      rx += (mouseX - rx) * 0.18;
      ry += (mouseY - ry) * 0.18;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const setState = (target) => {
      el.classList.remove('is-link', 'is-button', 'has-label');
      if (!target) return;
      const kind = target.getAttribute('data-cursor');
      if (kind === 'link') el.classList.add('is-link');
      else if (kind === 'button') el.classList.add('is-button');
      else if (kind === 'expand') {
        el.classList.add('has-label');
        const lbl = target.dataset.label || 'Open';
        label.textContent = lbl;
      }
    };

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor]');
      setState(target);
    });
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest?.('[data-cursor]')) {
        setState(null);
      }
    });
    document.addEventListener('mouseleave', () => el.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => el.classList.remove('is-hidden'));
  }

  /* ========== Unified mousemove handler (spotlight + cursor) ========== */

  if (!prefersReducedMotion && hasFinePointer) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (mouseRaf) return;
      mouseRaf = requestAnimationFrame(() => {
        if (spotlight) {
          spotlight.style.setProperty('--mx', `${mouseX}px`);
          spotlight.style.setProperty('--my', `${mouseY}px`);
        }
        mouseRaf = null;
      });
    });
  }

  /* ========== Scroll listener ========== */

  const nav = document.getElementById('nav');
  let scrollRaf = null;
  const onScroll = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      updateProgress();
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
      scrollRaf = null;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ========== Reveal on scroll ========== */

  const reveals = document.querySelectorAll('.reveal, .hero-title .line');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Animate skill bars on reveal
          const bar = entry.target.querySelector?.('.skill-bar-fill');
          if (bar) {
            const lvl = parseFloat(bar.getAttribute('data-level')) || 0;
            bar.style.width = Math.round(lvl * 100) + '%';
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.skill-bar-fill').forEach((b) => {
      b.style.width = Math.round(parseFloat(b.getAttribute('data-level') || 0) * 100) + '%';
    });
  }

  // Recruiters often see portfolio links through previews, screenshots, and
  // saved full-page captures. Ensure non-visited sections never remain hidden.
  window.setTimeout(() => {
    document.documentElement.classList.add('reveals-done');
    reveals.forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.skill-bar-fill').forEach((b) => {
      if (!b.style.width) {
        b.style.width = Math.round(parseFloat(b.getAttribute('data-level') || 0) * 100) + '%';
      }
    });
  }, 2500);

  /* ---- Staggered hero reveal ---- */
  document.querySelectorAll('.hero-title .line').forEach((line, i) => {
    line.style.transitionDelay = `${80 + i * 120}ms`;
  });
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${260 + i * 90}ms`;
  });
  // Trigger hero title lines immediately (they're at top of page)
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero-title .line').forEach((l) => l.classList.add('is-visible'));
  });

  /* ========== Scroll-spy ========== */

  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ========== Skills filter ========== */

  const filterBtns = document.querySelectorAll('.chip-filter');
  const skillRows = () => document.querySelectorAll('.skill-row');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      const filter = btn.dataset.filter;
      skillRows().forEach((row) => {
        const match = filter === 'all' || row.dataset.cat === filter;
        row.classList.toggle('is-dim', !match);
      });
    });
  });

  /* ========== Project tilt + pointer glow ========== */

  if (!prefersReducedMotion && hasFinePointer && grid) {
    grid.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.project');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--px', `${(x / r.width) * 100}%`);
      card.style.setProperty('--py', `${(y / r.height) * 100}%`);
    });
  }

  /* ========== Theme toggle ========== */

  const themeToggle = document.getElementById('theme-toggle');
  const getTheme = () => document.documentElement.getAttribute('data-theme') || 'dark';
  const setTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('sh-theme', t); } catch (e) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f6f3ed' : '#0b0b0c');
  };
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  /* ========== Live local time ========== */

  const tEl = document.getElementById('local-time');
  if (tEl) {
    const fmt = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZoneName: 'short',
    });
    const tick = () => { tEl.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30 * 1000);
  }

  /* ========== Footer dates ========== */

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const updatedEl = document.getElementById('updated');
  if (updatedEl) {
    // Uses document.lastModified as a proxy for "last updated"
    try {
      const d = new Date(document.lastModified);
      updatedEl.textContent = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    } catch { /* keep default */ }
  }
})();
