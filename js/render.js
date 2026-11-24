/* ==========================================================================
   TheDavidEze Photography — RENDER DISPATCHER
   Studio: TheVials Services
   --------------------------------------------------------------------------
   Pages declare intent with data-render="..." hooks. This module fills them
   from CONFIG, keeping content in one editable place and markup lean.
   Available hooks:
     collections · services · pricing:<serviceId> · addons · testimonials
     portfolio:<filter> · projects · faqs · process · prep · policies
     portfolio-masonry · instagram · stats · hours
   ========================================================================== */

const RENDER = {

  init() {
    $$("[data-render]").forEach(node => {
      const [key, arg] = node.dataset.render.split(":");
      if (typeof this[key] === "function") {
        try { this[key](node, arg); }
        catch (err) { console.warn("[render] " + key + " failed:", err); }
      }
    });
    if (typeof PAGE !== "undefined" && PAGE.afterRender) PAGE.afterRender();
    APP.reveal();          // observe any newly injected reveal elements
    APP.accordion();       // wire any injected accordions
  },

  /* -- Featured collections -------------------------------------------- */
  collections(node) {
    node.innerHTML = CONFIG.collections.map((c, i) => APP.collectionTile(c, i % 3)).join("");
  },

  /* -- Service overview cards ----------------------------------------- */
  services(node) {
    node.innerHTML = CONFIG.services.map((s, i) => APP.serviceCard(s, (i + 1) % 3)).join("");
  },

  /* -- Pricing cards for one service ---------------------------------- */
  pricing(node, id) {
    const s = UTIL.service(id);
    if (!s) return;
    node.innerHTML = s.packages.map((p, i) => APP.priceCard(s, p, i)).join("");
  },

  /* -- Add-on list ---------------------------------------------------- */
  addons(node) {
    node.innerHTML = `<ul class="stack--sm" style="display:grid;gap:.7rem">
      ${CONFIG.addons.map(a => `<li style="display:flex;justify-content:space-between;gap:1.4rem;padding:.8rem 0;border-top:1px solid var(--line);align-items:baseline">
        <span style="font-size:.92rem">${UTIL.esc(a.name)}
          <em style="display:block;font-size:.74rem;color:var(--taupe);font-style:normal">${UTIL.esc(a.note)}</em>
        </span>
        <b style="font-family:var(--font-display);font-size:1.15rem;white-space:nowrap;font-variant-numeric:tabular-nums">${UTIL.naira(a.price)}</b>
      </li>`).join("")}
    </ul>`;
  },

  /* -- Testimonials (clearly labelled demonstration content) ---------- */
  testimonials(node) {
    node.innerHTML = `<div class="notice" style="margin-bottom:2rem">
      <span class="notice__ico" aria-hidden="true">⚠</span>
      <p><b>Demonstration content.</b> These quotes were written for this prototype to show layout and tone.
         They are not real client testimonials. Replace them in <code>js/config.js</code> with genuine,
         permissioned feedback before launch.</p></div>` +
    CONFIG.testimonials.map((t, i) => `
      <figure class="reveal" data-delay="${i % 3}"
        style="display:grid;gap:1.1rem;align-content:start;border-top:1px solid var(--line);padding-top:1.5rem">
        <span style="font-family:var(--font-display);font-size:2.6rem;line-height:.4;color:var(--gold);opacity:.5" aria-hidden="true">“</span>
        <blockquote style="font-family:var(--font-display);font-size:var(--step-1);line-height:1.42;color:var(--ink)">${UTIL.esc(t.quote)}</blockquote>
        <figcaption style="display:flex;gap:.9rem;align-items:center;font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;color:var(--taupe)">
          <span aria-hidden="true" style="width:34px;height:34px;border:1px solid var(--gold);border-radius:50%;display:grid;place-items:center;font-size:.62rem;color:var(--gold-deep)">${t.initials}</span>
          ${UTIL.esc(t.name)} · ${UTIL.esc(t.role)}
        </figcaption>
      </figure>`).join("");
  },

  /* -- Portfolio grid (optionally filtered) --------------------------- */
  portfolio(node, filter) {
    const list = CONFIG.portfolio.filter(p => !filter || filter === "all" || p.c === filter);
    node.innerHTML = list.map((p, i) => `
      <figure class="masonry__item" data-lb="${i}" tabindex="0" role="button"
        aria-label="Open larger view of: ${UTIL.esc(p.a)}" style="animation-delay:${Math.min(i * 40, 400)}ms">
        <img src="${CONFIG.img(p.id, 760)}" srcset="${CONFIG.imgSet(p.id)}"
             sizes="(max-width:560px) 100vw, (max-width:980px) 50vw, 33vw"
             alt="${UTIL.esc(p.a)}" loading="lazy" decoding="async">
        <figcaption><span>${UTIL.esc(p.a)}</span><span style="opacity:.6">${p.c}</span></figcaption>
      </figure>`).join("");
    // Store the list on the node for the lightbox to consume
    node.dataset.lbList = JSON.stringify(list.map(p => ({
      src: CONFIG.img(p.id, 1500), thumb: CONFIG.img(p.id, 200, 200),
      srcset: CONFIG.imgSet(p.id), title: p.a, caption: p.c
    })));
    this.bindGallery(node);
  },

  /* -- Project case-study cards --------------------------------------- */
  projects(node) {
    node.innerHTML = CONFIG.projects.map((p, i) => `
      <article class="collection reveal" data-delay="${i % 3}">
        <a href="project.html?p=${p.id}" aria-label="${UTIL.esc(p.title)} — ${UTIL.esc(p.subtitle)}">
          <div class="collection__media">
            <img src="${CONFIG.img(p.cover, 900)}" srcset="${CONFIG.imgSet(p.cover)}"
                 sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw"
                 alt="${UTIL.esc(p.title)} — ${UTIL.esc(p.subtitle)}" loading="lazy" decoding="async">
          </div>
          <div class="collection__body">
            <span class="collection__cat">${UTIL.esc(p.category)}</span>
            <h3 class="collection__title">${UTIL.esc(p.title)}</h3>
            <span class="collection__meta">${UTIL.esc(p.subtitle)}</span>
            <span class="collection__cta">View project →</span>
          </div>
        </a>
      </article>`).join("");
  },

  /* -- FAQ accordion -------------------------------------------------- */
  faqs(node) {
    node.innerHTML = CONFIG.faqs.map((f, i) => APP.accItem(i, f.q, f.a)).join("");
  },
  policies(node) {
    node.innerHTML = CONFIG.policies.map((p, i) => APP.accItem(i, p.title, p.body)).join("");
  },
  process(node) {
    node.innerHTML = `<ol class="index-list">` + CONFIG.process.map(p =>
      `<li><div><b style="font-family:var(--font-display);font-size:1.15rem;font-weight:500">${UTIL.esc(p.step)}</b>
       <p style="margin-top:.35rem;color:var(--charcoal);font-size:.92rem">${UTIL.esc(p.detail)}</p></div></li>`).join("") + `</ol>`;
  },
  prep(node) {
    node.innerHTML = CONFIG.prepGuide.map((p, i) => `
      <article class="service-card reveal" data-delay="${i % 3}" style="gap:.7rem">
        <span class="service-card__num">${String(i + 1).padStart(2, "0")}</span>
        <h3 style="font-size:var(--step-1)">${UTIL.esc(p.title)}</h3>
        <p style="font-size:.9rem">${UTIL.esc(p.body)}</p>
      </article>`).join("");
  },

  /* -- Instagram / social strip (editable links) ---------------------- */
  instagram(node) {
    const shots = [13305426, 33714925, 19203827, 37900999, 33769352, 28751624, 4138802, 10670833, 32145882, 30822485];
    const cap   = ["Golden hour vows", "Studio editorial", "The long table", "Product campaign",
                   "Ordinary days", "Single-source light", "Quiet ceremony", "Hard light study", "Evening gala", "Pre-wedding"];
    const track = shots.map((id, i) =>
      `<a class="marquee__item" data-ig="${cap[i]}" href="#" target="_blank" rel="noopener noreferrer"
          aria-label="Instagram post: ${cap[i]} — link is a placeholder">
         <img src="${CONFIG.img(id, 500)}" srcset="${CONFIG.imgSet(id)}" sizes="250px"
              alt="${cap[i]} — sample photograph from the TheDavidEze Photography social portfolio" loading="lazy" decoding="async">
       </a>`).join("");
    node.innerHTML = `<div class="marquee"><div class="marquee__track">${track}</div><div class="marquee__track" aria-hidden="true">${track}</div></div>
      <p class="form-note text--center" style="margin-top:1.2rem">Instagram grid is a demonstration strip — replace the placeholder links in <code>js/config.js</code>.</p>`;
  },

  /* -- Opening hours -------------------------------------------------- */
  hours(node) {
    node.innerHTML = `<dl style="display:grid;gap:.8rem">` + CONFIG.contact.hours.map(h =>
      `<div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.7rem">
        <dt style="font-size:.76rem;letter-spacing:.18em;text-transform:uppercase;color:var(--taupe)">${UTIL.esc(h.day)}</dt>
        <dd style="font-size:.9rem;text-align:right">${UTIL.esc(h.time)}</dd>
      </div>`).join("") + `</dl>
      <p class="form-note" style="margin-top:1rem">Hours are placeholders. Confirm before publishing.</p>`;
  },

  /* -- Attach lightbox behaviour to a gallery node -------------------- */
  bindGallery(node) {
    // Guard against binding twice when a gallery is re-rendered (e.g. filtering)
    if (node.dataset.bound === "1") return;
    node.dataset.bound = "1";
    const click = (e) => {
      const fig = e.target.closest("[data-lb]");
      if (!fig) return;
      e.preventDefault();
      const list = JSON.parse(node.dataset.lbList || "[]");
      APP.openLightbox(list, +fig.dataset.lb);
    };
    node.addEventListener("click", click);
    node.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const fig = e.target.closest("[data-lb]");
      if (!fig) return;
      e.preventDefault();
      const list = JSON.parse(node.dataset.lbList || "[]");
      APP.openLightbox(list, +fig.dataset.lb);
    });
  },
};

/* Hook into the same boot cycle as APP */
document.addEventListener("DOMContentLoaded", () => RENDER.init());
