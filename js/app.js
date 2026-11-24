/* ==========================================================================
   TheDavidEze Photography — CORE UI SCRIPT
   Studio: TheVials Services
   --------------------------------------------------------------------------
   Handles: navigation state, mobile drawer, scroll-reveal, sticky header,
   lightbox, toasts, newsletter, back-to-top, and shared render helpers.
   No frameworks. No dependencies. Progressive enhancement throughout.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Tiny DOM helpers
   -------------------------------------------------------------------------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

/* --------------------------------------------------------------------------
   App namespace
   -------------------------------------------------------------------------- */
const APP = {

  /* ---- 01. Boot ------------------------------------------------------- */
  init() {
    this.markCurrentPage();
    this.header();
    this.drawer();
    this.reveal();
    this.lightboxInit();
    this.toTop();
    this.footerBits();
    this.newsletter();
    this.year();
  },

  /* ---- 02. Current page highlighting (nav accessibility) -------------- */
  markCurrentPage() {
    const path = location.pathname.split("/").pop() || "index.html";
    $$("[data-nav]").forEach(link => {
      const target = (link.getAttribute("href") || "").split("?")[0].split("#")[0];
      if (target === path || (path === "" && target === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  },

  /* ---- 03. Sticky header: solid on scroll, hides on scroll-down -------- */
  header() {
    const h = $(".site-header");
    if (!h) return;
    let last = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      h.classList.toggle("is-scrolled", y > 40);
      // Never hide near the top, and reveal immediately when scrolling up.
      if (y > 320 && y > last + 6) h.classList.add("is-hidden");
      else if (y < last - 6) h.classList.remove("is-hidden");
      last = y;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });

    // Header over a dark hero stays transparent until scrolled.
    if (h.dataset.start === "transparent" && window.scrollY < 40) h.classList.add("is-transparent");
    onScroll();
  },

  /* ---- 04. Mobile navigation drawer ----------------------------------- */
  drawer() {
    const burger = $(".burger"), drawer = $(".drawer");
    if (!burger || !drawer) return;

    const setOpen = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("nav-locked", open);
      // Staggered entrance
      $$(".drawer__link", drawer).forEach((l, i) => {
        l.style.transitionDelay = open ? (120 + i * 55) + "ms" : "0ms";
      });
      if (open) {
        const first = $(".drawer__link", drawer);
        if (first) first.focus({ preventScroll: true });
      } else {
        burger.focus({ preventScroll: true });
      }
    };

    burger.addEventListener("click", () => setOpen(burger.getAttribute("aria-expanded") !== "true"));
    $$(".drawer a", drawer).forEach(a => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) setOpen(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1080 && drawer.classList.contains("is-open")) setOpen(false);
    });
  },

  /* ---- 05. Scroll reveal (IntersectionObserver) ----------------------- */
  reveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(i => i.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    items.forEach(i => io.observe(i));
  },

  /* ---- 06. Lightbox -------------------------------------------------- */
  /* Public API: APP.openLightbox(items, startIndex)
     items: [{ src, srcset, title, caption }]                        */
  lightboxInit() {
    if ($("#lightbox")) return;

    const lb = el("div", "lightbox");
    lb.id = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = `
      <div class="lightbox__bar">
        <span data-lb-count></span>
        <button class="lb-btn" data-lb-close aria-label="Close image viewer">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.2"/></svg>
        </button>
      </div>
      <div class="lightbox__stage">
        <div class="lb-nav">
          <button class="lb-btn" data-lb-prev aria-label="Previous image">
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M5 1L1 5l4 4M1 5h14" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
          </button>
          <button class="lb-btn" data-lb-next aria-label="Next image">
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M11 1l4 4-4 4M15 5H1" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
          </button>
        </div>
        <figure class="lightbox__figure" data-lb-figure></figure>
      </div>
      <div class="lightbox__thumbs" data-lb-thumbs></div>`;
    document.body.appendChild(lb);

    const fig = $("[data-lb-figure]", lb), count = $("[data-lb-count]", lb),
          thumbs = $("[data-lb-thumbs]", lb);
    let items = [], i = 0, lastFocus = null;

    const render = () => {
      const it = items[i];
      if (!it) return;
      fig.innerHTML =
        `<img class="lightbox__img" src="${it.src}" ${it.srcset ? `srcset="${it.srcset}" sizes="(max-width:1200px) 92vw, 1100px"` : ""} alt="${it.alt || it.title || "Portfolio photograph"}" decoding="async">` +
        ((it.title || it.caption) ? `<figcaption class="lightbox__caption">${it.title ? `<b>${it.title}</b>` : ""}${it.caption || ""}</figcaption>` : "");
      count.textContent = (i + 1) + " / " + items.length;
      $$("button", thumbs).forEach((b, n) => b.setAttribute("aria-current", String(n === i)));
      const img = $("img", fig);
      img.addEventListener("click", () => next());
    };
    const next = () => { i = (i + 1) % items.length; render(); };
    const prev = () => { i = (i - 1 + items.length) % items.length; render(); };

    const open = (list, start) => {
      items = list; i = start || 0;
      lastFocus = document.activeElement;
      thumbs.innerHTML = items.map((it, n) =>
        `<button type="button" data-lb-thumb="${n}" aria-label="View image ${n + 1}">
           <img src="${it.thumb || it.src}" alt="" loading="lazy" decoding="async">
         </button>`).join("");
      render();
      lb.classList.add("is-open");
      document.body.classList.add("nav-locked");
      $("[data-lb-close]", lb).focus();
    };
    const close = () => {
      lb.classList.remove("is-open");
      document.body.classList.remove("nav-locked");
      if (lastFocus) lastFocus.focus();
    };

    $("[data-lb-close]", lb).addEventListener("click", close);
    $("[data-lb-prev]", lb).addEventListener("click", prev);
    $("[data-lb-next]", lb).addEventListener("click", next);
    thumbs.addEventListener("click", e => {
      const b = e.target.closest("[data-lb-thumb]");
      if (b) { i = +b.dataset.lbThumb; render(); }
    });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
    lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox__stage")) close(); });

    this.openLightbox = open;
    this.closeLightbox = close;
  },

  /* ---- 07. Toast notifications --------------------------------------- */
  toast(msg, type) {
    let stack = $(".toast-stack");
    if (!stack) { stack = el("div", "toast-stack"); document.body.appendChild(stack); }
    const t = el("div", "toast" + (type === "err" ? " toast--err" : ""));
    t.setAttribute("role", "status");
    t.innerHTML =
      `<span aria-hidden="true">${type === "err" ? "✕" : "✓"}</span>
       <span>${UTIL.esc(msg)}</span>
       <button class="toast__close" aria-label="Dismiss notification">×</button>`;
    stack.appendChild(t);
    const kill = () => { t.style.opacity = "0"; setTimeout(() => t.remove(), 260); };
    $(".toast__close", t).addEventListener("click", kill);
    setTimeout(kill, 5200);
  },

  /* ---- 08. Back to top ----------------------------------------------- */
  toTop() {
    const b = $(".to-top");
    if (!b) return;
    const t = () => b.classList.toggle("is-visible", window.scrollY > 700);
    window.addEventListener("scroll", t, { passive: true }); t();
    b.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  },

  /* ---- 09. Footer housekeeping --------------------------------------- */
  footerBits() {
    // Fill any [data-social] containers with links from CONFIG
    $$("[data-social]").forEach(box => {
      const style = box.dataset.social;
      box.innerHTML = CONFIG.contact.social.map(s =>
        `<a href="${s.url}" target="_blank" rel="noopener noreferrer" title="${s.name} — ${UTIL.esc(s.handle)} [PLACEHOLDER link]"
           aria-label="${s.name} (opens in a new tab)">${style === "abbr" ? s.abbr : s.name}</a>`).join("");
    });
    $$("[data-year]").forEach(n => n.textContent = new Date().getFullYear());
    $$("[data-deposit-pct]").forEach(n => n.textContent = CONFIG.commercial.depositPercent + "%");
    $$("[data-price-note]").forEach(n => n.textContent = CONFIG.commercial.priceDisclaimer);
  },

  /* ---- 10. Newsletter (no backend configured) ------------------------ */
  newsletter() {
    const form = $("#newsletter-form");
    if (!form) return;
    const msg = $("#newsletter-msg"), btn = $("button[type=submit]", form);

    form.addEventListener("submit", e => {
      e.preventDefault();
      const input = $("input", form);
      const val = (input.value || "").trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);

      if (!ok) {
        msg.className = "msg err";
        msg.textContent = "Please enter a valid email address.";
        input.focus();
        APP.toast("Invalid email address", "err");
        return;
      }
      // Simulated processing state — no data is transmitted or stored anywhere.
      btn.disabled = true;
      const original = btn.innerHTML;
      btn.innerHTML = '<span class="loader" aria-hidden="true"></span> Sending';
      msg.className = "msg";
      msg.textContent = "";

      setTimeout(() => {
        btn.disabled = false; btn.innerHTML = original;
        msg.className = "msg ok";
        msg.textContent = "Demo only — no email was saved. Connect a mailing-list API to make this functional.";
        APP.toast("Newsletter captured locally in this demo only");
        form.reset();
      }, 1100);
    });
  },

  /* ---- 11. Current year in any element ------------------------------ */
  year() { $$("[data-year]").forEach(n => n.textContent = new Date().getFullYear()); },

  /* ======================================================================
     RENDER HELPERS — reused across pages
     ====================================================================== */

  /** Editorial image with responsive srcset, lazy loading and descriptive alt */
  figure(opts) {
    const { id, alt, ratio = "frame--ratio-4x5", extra = "", sizes = "(max-width:700px) 100vw, 33vw", eager = false } = opts;
    return `<figure class="frame ${ratio} ${extra}">
      <img src="${CONFIG.img(id, 900)}" srcset="${CONFIG.imgSet(id)}" sizes="${sizes}"
           alt="${UTIL.esc(alt)}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    </figure>`;
  },

  /** Collection tile */
  collectionTile(c, delay) {
    return `<a class="collection reveal" data-delay="${delay || 0}" href="${c.href}" aria-label="${UTIL.esc(c.title)} collection — ${UTIL.esc(c.cat)}">
      <div class="collection__media">
        <img src="${CONFIG.img(c.img, 900)}" srcset="${CONFIG.imgSet(c.img)}" sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw"
             alt="${UTIL.esc(c.title)} — ${UTIL.esc(c.blurb)}" loading="lazy" decoding="async">
      </div>
      <div class="collection__body">
        <span class="collection__cat">${UTIL.esc(c.cat)}</span>
        <h3 class="collection__title">${UTIL.esc(c.title)}</h3>
        <span class="collection__meta">${UTIL.esc(c.count)}</span>
        <span class="collection__cta">View collection →</span>
      </div>
    </a>`;
  },

  /** Service overview card (used on home + services index) */
  serviceCard(s, delay) {
    const from = s.packages[0].price;
    return `<article class="service-card reveal" data-delay="${delay || 0}">
      <span class="service-card__num">${UTIL.esc(s.name)}</span>
      <h3><a href="services.html#${s.slug}">${UTIL.esc(s.name)}</a></h3>
      <p>${UTIL.esc(s.short)}</p>
      <ul class="service-card__list">
        <li>Coverage: ${UTIL.esc(s.duration)}</li>
        <li>From ${UTIL.naira(from)} <span class="placeholder-tag">illustrative</span></li>
        <li>${UTIL.esc(s.packages.length)} package tiers</li>
      </ul>
      <div class="service-card__price">
        <span class="text--xs text--muted">From</span>
        <b>${UTIL.naira(from)}</b>
      </div>
      <a class="link-arrow" href="services.html#${s.slug}">Explore
        <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M11 1l4 4-4 4M15 5H1" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
      </a>
    </article>`;
  },

  /** Pricing card for a package */
  priceCard(s, p, delay) {
    return `<article class="price-card ${p.featured ? "price-card--featured" : ""} reveal" data-delay="${delay || 0}">
      ${p.featured ? '<span class="price-card__flag">Most requested</span>' : ""}
      <span class="price-card__tier">${UTIL.esc(p.tier)} tier</span>
      <h3 class="price-card__name">${UTIL.esc(p.name)}</h3>
      <p class="price-card__amount">${UTIL.naira(p.price)}</p>
      <p class="price-card__note">${UTIL.esc(s.name)} · illustration only</p>
      <ul class="price-card__features">
        <li>${UTIL.esc(p.coverage)}</li>
        <li>Approx. ${p.photos} edited photographs</li>
        ${p.deliverables.map(d => `<li>${UTIL.esc(d)}</li>`).join("")}
        <li>Delivery in ${UTIL.esc(p.timeline)}</li>
      </ul>
      <a class="btn ${p.featured ? "btn--gold" : "btn--outline"} btn--block"
         href="booking.html?service=${s.id}&package=${encodeURIComponent(p.tier)}">Book this package</a>
    </article>`;
  },

  /** Accordion item */
  accItem(i, q, a, list) {
    const body = Array.isArray(a)
      ? `<ul>${a.map(x => `<li>${UTIL.esc(x)}</li>`).join("")}</ul>`
      : `<p>${UTIL.esc(a)}</p>`;
    return `<div class="acc">
      <h3 style="margin:0">
        <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-p-${i}" id="acc-b-${i}">
          <span><span class="acc__num">${String(i + 1).padStart(2, "0")}</span> &nbsp;${UTIL.esc(q)}</span>
          <span class="acc__ico" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="acc__panel" id="acc-p-${i}" role="region" aria-labelledby="acc-b-${i}" data-open="false">
        <div>${body}</div>
      </div>
    </div>`;
  },

  /** Wire up all accordions on a page */
  accordion(root = document) {
    $$(".acc__btn", root).forEach(btn => {
      btn.addEventListener("click", () => {
        const panel = document.getElementById(btn.getAttribute("aria-controls"));
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.dataset.open = String(!open);
      });
    });
  },
};

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  APP.init();
  if (typeof PAGE !== "undefined" && PAGE.init) PAGE.init();
});
