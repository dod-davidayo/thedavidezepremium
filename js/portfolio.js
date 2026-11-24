/* ==========================================================================
   TheDavidEze Photography — PORTFOLIO PAGE + PROJECT DETAIL PAGE
   Studio: TheVials Services
   --------------------------------------------------------------------------
   Page A (portfolio.html): category filtering, live count, empty state,
   deep-linking via ?c=<category>, URL/history sync.
   Page B (project.html):   case-study router via ?p=<projectId>.
   ========================================================================== */

const PAGE = {

  init() {
    this.route = document.body.dataset.page;

    if (this.route === "portfolio")  this.portfolioPage();
    if (this.route === "project")    this.projectPage();
  },

  /* ======================================================================
     PORTFOLIO — filtering
     ====================================================================== */
  portfolioPage() {
    const bar   = $("#filters");
    const grid  = $("#gallery");
    const count = $("#gallery-count");
    const empty = $("#gallery-empty");
    if (!bar || !grid) return;

    const cats = CONFIG.categories;
    const liveParam = UTIL.param("c");

    // Build filter buttons with live counts
    bar.innerHTML = cats.map(c => {
      const n = c.id === "all"
        ? CONFIG.portfolio.length
        : CONFIG.portfolio.filter(p => p.c === c.id).length;
      return `<button class="filter-btn" type="button" data-filter="${c.id}" aria-pressed="false">
                ${c.label}<span class="count">${n}</span>
              </button>`;
    }).join("");

    const setFilter = (id, push) => {
      // Guard against an invalid or empty category
      const valid = cats.some(c => c.id === id) && (id === "all" || CONFIG.portfolio.some(p => p.c === id));
      const target = valid ? id : "all";

      $$("button", bar).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.filter === target)));

      // Re-render the gallery for the chosen category
      RENDER.portfolio(grid, target);

      const shown = target === "all" ? CONFIG.portfolio.length
                                     : CONFIG.portfolio.filter(p => p.c === target).length;
      const label = cats.find(c => c.id === target).label.toLowerCase();
      count.textContent = shown + (shown === 1 ? " image" : " images") + " — " + label;
      empty.classList.toggle("is-hidden", shown > 0);

      if (push && window.history && history.replaceState) {
        const url = target === "all" ? "portfolio.html" : "portfolio.html?c=" + target;
        history.replaceState({}, "", url);
      }
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    bar.addEventListener("click", e => {
      const b = e.target.closest("[data-filter]");
      if (b) setFilter(b.dataset.filter, true);
    });
    $$("[data-reset-filters]").forEach(b => b.addEventListener("click", () => setFilter("all", true)));

    setFilter(liveParam || "all", false);
  },

  /* ======================================================================
     PROJECT — case study router
     ====================================================================== */
  projectPage() {
    const host = $("#project");
    if (!host) return;

    const id = UTIL.param("p");
    const p  = CONFIG.projects.find(x => x.id === id);

    if (!p) { this.projectIndex(host); return; }

    document.title = p.title + " — " + p.category + " | TheDavidEze Photography";
    const desc = (p.subtitle + ". " + p.intro).slice(0, 155);
    let md = $('meta[name="description"]');
    if (md) md.setAttribute("content", desc);
    let cn = $('link[rel="canonical"]');
    if (cn) cn.setAttribute("href", "https://www.thedavideze.example/portfolio/" + p.id);

    const siblings = CONFIG.projects.filter(x => x.id !== p.id);
    const next = siblings[0];

    host.innerHTML = `
      <section class="page-hero">
        <div class="page-hero__bg" aria-hidden="true">
          <img src="${CONFIG.img(p.cover, 1800)}" alt="" loading="eager" decoding="async">
        </div>
        <div class="container">
          <nav class="page-hero__crumbs" aria-label="Breadcrumb">
            <a href="index.html">Home</a> <span aria-hidden="true">/</span>
            <a href="portfolio.html">Portfolio</a> <span aria-hidden="true">/</span>
            <span>${UTIL.esc(p.title)}</span>
          </nav>
          <p class="eyebrow--onDark">${UTIL.esc(p.category)}</p>
          <h1 class="page-hero__title" style="margin-top:1rem">${UTIL.esc(p.title)}</h1>
          <p class="lead lead--light" style="margin-top:1.2rem;max-width:50ch">${UTIL.esc(p.subtitle)}</p>
        </div>
      </section>

      <section class="section" aria-labelledby="proj-body">
        <div class="container">
          <div class="editorial">
            <aside class="editorial__rail">
              <div class="stack stack--lg">
                <div>
                  <p class="eyebrow">Project details</p>
                  <dl style="display:grid;gap:1rem;margin-top:1.2rem">
                    <div style="border-top:1px solid var(--line);padding-top:.7rem">
                      <dt class="text--xs text--muted" style="letter-spacing:.2em;text-transform:uppercase">Client</dt>
                      <dd class="display-serif-italic" style="font-size:1.15rem">${UTIL.esc(p.title)}</dd>
                    </div>
                    <div style="border-top:1px solid var(--line);padding-top:.7rem">
                      <dt class="text--xs text--muted" style="letter-spacing:.2em;text-transform:uppercase">Location</dt>
                      <dd style="font-size:.92rem">${UTIL.esc(p.location)}</dd>
                    </div>
                    <div style="border-top:1px solid var(--line);padding-top:.7rem">
                      <dt class="text--xs text--muted" style="letter-spacing:.2em;text-transform:uppercase">Date</dt>
                      <dd style="font-size:.92rem">${UTIL.esc(p.date)}</dd>
                    </div>
                    <div style="border-top:1px solid var(--line);padding-top:.7rem">
                      <dt class="text--xs text--muted" style="letter-spacing:.2em;text-transform:uppercase">Discipline</dt>
                      <dd style="font-size:.92rem">${UTIL.esc(p.category)}</dd>
                    </div>
                    <div style="border-top:1px solid var(--line);padding-top:.7rem">
                      <dt class="text--xs text--muted" style="letter-spacing:.2em;text-transform:uppercase">Scope</dt>
                      <dd><ul class="stack--xs" style="font-size:.86rem;margin-top:.4rem">
                        ${p.services.map(s => `<li style="display:flex;gap:.6rem"><span style="color:var(--gold-deep)">—</span>${UTIL.esc(s)}</li>`).join("")}
                      </ul></dd>
                    </div>
                  </dl>
                  <a class="btn btn--outline btn--block" style="margin-top:1.8rem" href="booking.html">Book similar work</a>
                </div>

                <div class="stats" style="grid-template-columns:1fr">
                  ${p.stats.map(s => `<div class="stat"><div class="stat__value">${UTIL.esc(s.v)}</div>
                    <div class="stat__label">${UTIL.esc(s.k)}</div></div>`).join("")}
                </div>
              </div>
            </aside>

            <div class="editorial__body" style="max-width:var(--measure)">
              <h2 id="proj-body">The brief</h2>
              <p class="lead">${UTIL.esc(p.intro)}</p>
              ${p.body.map((para, i) => `<p class="reveal" data-delay="${Math.min(i,3)}">${UTIL.esc(para)}</p>`).join("")}

              <div class="notice" style="margin-top:2rem">
                <span class="notice__ico" aria-hidden="true">ℹ</span>
                <p><b>Demonstration case study.</b> Client names, locations, dates, statistics and imagery in this
                   project page are illustrative. Replace with real, permissioned project records and confirm that
                   each client has agreed to public use of their photographs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--warm" aria-labelledby="proj-gallery">
        <div class="container">
          <div class="section-head section-head--row" style="margin-bottom:2rem">
            <div>
              <p class="eyebrow reveal">Gallery</p>
              <h2 class="reveal" data-delay="1" id="proj-gallery" style="font-size:var(--step-2)">Selected frames</h2>
            </div>
            <div class="head-aside"><p class="text--xs text--muted">Click any image to open the full-screen viewer.</p></div>
          </div>
          <div class="masonry" id="project-gallery" data-render="portfolio:${p.collection}"></div>
        </div>
      </section>

      <section class="section" aria-labelledby="proj-next">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow reveal">Continue</p>
            <h2 class="reveal" data-delay="1" id="proj-next" style="font-size:var(--step-2)">More projects</h2>
          </div>
          <div class="grid grid--3" id="more-projects"></div>
          <div class="grid grid--2" style="margin-top:2.5rem;gap:1rem">
            <a class="btn btn--outline" href="portfolio.html">← Back to all work</a>
            <a class="btn btn--gold" href="booking.html">Start a booking request</a>
          </div>
        </div>
      </section>`;

    // Related projects
    $("#more-projects").innerHTML = siblings.slice(0, 3).map(x => `
      <article class="collection reveal">
        <a href="project.html?p=${x.id}" aria-label="${UTIL.esc(x.title)} — ${UTIL.esc(x.subtitle)}">
          <div class="collection__media">
            <img src="${CONFIG.img(x.cover, 900)}" srcset="${CONFIG.imgSet(x.cover)}"
                 sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw"
                 alt="${UTIL.esc(x.title)} — ${UTIL.esc(x.subtitle)}" loading="lazy" decoding="async">
          </div>
          <div class="collection__body">
            <span class="collection__cat">${UTIL.esc(x.category)}</span>
            <h3 class="collection__title">${UTIL.esc(x.title)}</h3>
            <span class="collection__meta">${UTIL.esc(x.subtitle)}</span>
            <span class="collection__cta">View project →</span>
          </div>
        </a>
      </article>`).join("");

    APP.reveal();
  },

  /* Fallback: no project id supplied → show the index of all projects */
  projectIndex(host) {
    host.innerHTML = `
      <section class="page-hero">
        <div class="page-hero__bg" aria-hidden="true">
          <img src="${CONFIG.img(CONFIG.projects[0].cover, 1800)}" alt="" loading="eager" decoding="async">
        </div>
        <div class="container">
          <nav class="page-hero__crumbs" aria-label="Breadcrumb">
            <a href="index.html">Home</a> <span aria-hidden="true">/</span>
            <a href="portfolio.html">Portfolio</a> <span aria-hidden="true">/</span> <span>Projects</span>
          </nav>
          <p class="eyebrow--onDark">Case Studies</p>
          <h1 class="page-hero__title" style="margin-top:1rem">Select a project</h1>
          <p class="lead lead--light" style="margin-top:1.2rem;max-width:50ch">
            No project was specified. Choose one from the case studies below.
          </p>
        </div>
      </section>
      <section class="section">
        <div class="container"><div class="grid grid--3" data-render="projects"></div></div>
      </section>`;
    RENDER.projects($("[data-render=projects]", host));
    APP.reveal();
  },
};
