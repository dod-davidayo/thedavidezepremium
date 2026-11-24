/* ==========================================================================
   TheDavidEze Photography — ADMIN DASHBOARD (demonstration)
   Studio: TheVials Services
   --------------------------------------------------------------------------
   Renders a convincing studio operations dashboard from fictional data.

   ⚠️  THIS IS A CONCEPT, NOT A PRODUCT
   ------------------------------------------------
   • No data is persisted. A page refresh resets everything.
   • The passcode gate is cosmetic — it is visible in the page source.
   • Every booking, enquiry, client name and revenue figure is invented.
   • Required for production: real authentication, a database, an API layer,
     role-based access control, audit logs, and server-side validation.
   ========================================================================== */

const ADMIN = {

  data: { bookings: [], enquiries: [], view: "overview" },

  /* ====================================================================== */
  boot() {
    // Clone the demo dataset so we can mutate it without touching CONFIG
    this.data.bookings = JSON.parse(JSON.stringify(CONFIG.admin.bookings));
    this.data.enquiries = JSON.parse(JSON.stringify(CONFIG.admin.enquiries));

    this.gate();
  },

  /* ====================================================================== */
  /* Sign-in gate (cosmetic)                                                */
  /* ====================================================================== */
  gate() {
    const form = $("#admin-login");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const pass = $("#ad-pass").value.trim();
      const field = $('[data-field="adpass"]');

      if (pass !== CONFIG.admin.demoPasscode) {
        field.classList.add("is-invalid");
        $("#ad-pass-err").textContent = "Incorrect passcode. The demonstration passcode is shown above.";
        APP.toast("Incorrect passcode", "err");
        return;
      }
      field.classList.remove("is-invalid");
      $("#ad-pass-err").textContent = "";

      $("#authgate").classList.add("is-hidden");
      $("#admin").classList.remove("is-hidden");
      window.scrollTo({ top: 0 });

      this.buildTabs();
      this.bindNav();
      this.render();
      APP.toast("Signed in to the demonstration dashboard");
    });

    $("#admin-logout").addEventListener("click", () => {
      $("#admin").classList.add("is-hidden");
      $("#authgate").classList.remove("is-hidden");
      form.reset();
      window.scrollTo({ top: 0 });
    });
  },

  /* ====================================================================== */
  buildTabs() {
    const labels = {
      overview: "Overview", bookings: "Bookings", calendar: "Calendar", enquiries: "Enquiries",
      services: "Services & pricing", portfolio: "Portfolio", revenue: "Revenue", settings: "Settings",
    };
    $("#admin-tabs").innerHTML = Object.keys(labels).map(k =>
      `<button type="button" role="tab" data-view="${k}" aria-selected="${k === "overview"}">${labels[k]}</button>`).join("");
  },

  bindNav() {
    const go = (v) => {
      this.data.view = v;
      $$(".admin-view").forEach(p => p.classList.toggle("is-active", p.dataset.view === v));
      $$("#admin-nav [data-view]").forEach(b => b.setAttribute("aria-current", String(b.dataset.view === v)));
      $$("#admin-tabs [role=tab]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.view === v)));
      const meta = {
        overview:   ["Overview", "Studio performance at a glance — demonstration data"],
        bookings:   ["Bookings", "Manage requests, statuses and client details — nothing is saved"],
        calendar:   ["Booking calendar", "Scheduled coverage across the coming months"],
        enquiries:  ["Enquiries", "Website, WhatsApp and social enquiries awaiting response"],
        services:   ["Services & pricing", "Adjust packages and illustrative prices — session only"],
        portfolio:  ["Portfolio", "Collections, project pages and image metadata"],
        revenue:    ["Revenue overview", "Illustrative turnover by month and service line"],
        settings:   ["Settings & integrations", "Deposit, payment gateway and notification configuration"],
      }[v];
      $("#view-title").textContent = meta[0];
      $("#view-sub").textContent = meta[1];
      this.render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    $("#admin-nav").addEventListener("click", e => {
      const b = e.target.closest("[data-view]"); if (b) go(b.dataset.view);
    });
    $("#admin-tabs").addEventListener("click", e => {
      const b = e.target.closest("[data-view]"); if (b) go(b.dataset.view);
    });

    // "+ New booking" seeds a fresh pending record so the UI can be explored
    $("#seed-new").addEventListener("click", () => {
      const svc = CONFIG.services[Math.floor(Math.random() * CONFIG.services.length)];
      const pkg = svc.packages[Math.floor(Math.random() * 3)];
      this.data.bookings.unshift({
        ref: UTIL.makeRef(), client: "New Enquirer", email: "new.enquirer@example.com",
        phone: "+234 000 000 0000", service: svc.name, pkg: pkg.tier,
        date: new Date(Date.now() + 86400000 * (20 + Math.floor(Math.random() * 120))).toISOString().slice(0, 10),
        time: "10:00", location: "[City — PLACEHOLDER]",
        total: pkg.price, deposit: UTIL.deposit(pkg.price), status: "pending", guests: 0, isNew: true,
      });
      go("bookings");
      APP.toast("New demonstration booking added (not saved anywhere)");
    });

    go("overview");
  },

  /* ====================================================================== */
  render() {
    const v = this.data.view;
    const host = $('.admin-view[data-view="' + v + '"]');
    if (!host) return;

    $("[data-count=bookings]").textContent = this.data.bookings.length;
    $("[data-count=enquiries]").textContent = this.data.enquiries.filter(e => e.status === "new").length;

    host.innerHTML = ({
      overview: this.viewOverview, bookings: this.viewBookings, calendar: this.viewCalendar,
      enquiries: this.viewEnquiries, services: this.viewServices, portfolio: this.viewPortfolio,
      revenue: this.viewRevenue, settings: this.viewSettings,
    }[v] || (() => "")).call(this);

    // Delegated actions inside the freshly rendered view
    this.bindViewActions(host);
  },

  /* ====================================================================== */
  /* COMPUTED METRICS                                                       */
  /* ====================================================================== */
  metrics() {
    const b = this.data.bookings;
    const by = s => b.filter(x => x.status === s);
    const sum = arr => arr.reduce((n, x) => n + x.total, 0);
    const confirmedValue = sum(by("confirmed"));
    const completedValue = sum(by("completed"));
    const pendingValue = sum(by("pending"));
    const depositsHeld = b.filter(x => x.status === "confirmed" || x.status === "completed")
                          .reduce((n, x) => n + x.deposit, 0);
    return {
      total: b.length, pending: by("pending").length, confirmed: by("confirmed").length,
      completed: by("completed").length, cancelled: by("cancelled").length,
      pipeline: pendingValue + confirmedValue, confirmedValue, completedValue,
      pendingValue, depositsHeld,
      avgBooking: b.length ? Math.round(sum(b) / b.length) : 0,
      conversion: b.length ? Math.round(((by("confirmed").length + by("completed").length) / b.length) * 100) : 0,
      openEnquiries: this.data.enquiries.filter(e => e.status === "new").length,
    };
  },

  statusBadge(s) {
    const map = { confirmed: "badge--live", completed: "badge--live", pending: "badge--pending",
                  cancelled: "badge--cancel", draft: "badge--draft", published: "badge--live",
                  new: "badge--pending", replied: "badge--live", quoted: "badge--pending", closed: "badge--draft" };
    return `<span class="badge badge--dot ${map[s] || "badge--draft"}">${s}</span>`;
  },

  /* ====================================================================== */
  /* VIEW: OVERVIEW                                                         */
  /* ====================================================================== */
  viewOverview() {
    const m = this.metrics();
    const kpi = (label, value, delta, down) => `
      <div class="kpi"><span class="kpi__label">${label}</span>
        <span class="kpi__value">${value}</span>
        <span class="kpi__delta ${down ? "down" : ""}">${delta}</span></div>`;

    const months = CONFIG.admin.revenue;
    const max = Math.max(...months.map(x => x.v));
    const bars = months.map((x, i) => `
      <div class="barchart__col" title="${x.m}: ${UTIL.naira(x.v)}">
        <span class="barchart__val">${(x.v / 1000000).toFixed(1)}m</span>
        <div class="barchart__bar ${i === months.length - 1 ? "is-gold" : ""}" style="height:${Math.max(6, (x.v / max) * 100)}%;animation-delay:${i * 55}ms"></div>
        <span class="barchart__key">${x.m}</span>
      </div>`).join("");

    const recent = [...this.data.bookings].sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 5);

    return `
      <div class="kpis">
        ${kpi("Bookings on file", m.total, "+2 this week")}
        ${kpi("Pending requests", m.pending, "awaiting confirmation", true)}
        ${kpi("Confirmed value", UTIL.naira(m.confirmedValue), m.confirmed + " bookings")}
        ${kpi("Deposits held", UTIL.naira(m.depositsHeld), "illustrative")}
      </div>

      <div class="admin-grid admin-grid--2">
        <section class="panel">
          <div class="panel__head"><div><h2>Revenue — trailing 12 months</h2><p>Fictional demonstration data</p></div>
            <span class="placeholder-tag">demo data</span></div>
          <div class="barchart">${bars}</div>
          <p class="form-note">Values shown in millions of Naira. No accounting data exists behind this chart.</p>
        </section>

        <section class="panel">
          <div class="panel__head"><div><h3>Service mix</h3><p>Share of bookings by discipline</p></div></div>
          <div class="mix-bar">
            ${CONFIG.admin.serviceMix.map(s => `
              <div class="mix-row">
                <span>${s.label}</span>
                <span class="mix-row__track"><span class="mix-row__fill" style="display:block;width:${s.v * 2.2}%"></span></span>
                <b>${s.v}%</b>
              </div>`).join("")}
          </div>
          <hr class="rule">
          <div class="stack stack--sm" style="font-size:.82rem">
            <div style="display:flex;justify-content:space-between"><span>Average booking value</span><b>${UTIL.naira(m.avgBooking)}</b></div>
            <div style="display:flex;justify-content:space-between"><span>Enquiry → booking rate</span><b>${m.conversion}%</b></div>
            <div style="display:flex;justify-content:space-between"><span>Open enquiries</span><b>${m.openEnquiries}</b></div>
          </div>
        </section>
      </div>

      <section class="panel">
        <div class="panel__head"><div><h3>Recent activity</h3><p>Most recent bookings by event date</p></div>
          <button class="mini-btn mini-btn--gold" type="button" data-goto="bookings">View all bookings</button></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th scope="col">Ref</th><th scope="col">Client</th><th scope="col">Service</th>
              <th scope="col">Date</th><th scope="col">Total</th><th scope="col">Status</th></tr></thead>
            <tbody>
              ${recent.map(b => `<tr>
                <td><b>${b.ref}</b>${b.isNew ? ' <span class="badge badge--pending">new</span>' : ""}</td>
                <td>${UTIL.esc(b.client)}</td>
                <td>${UTIL.esc(b.service)}</td>
                <td>${UTIL.prettyDate(b.date)}</td>
                <td>${UTIL.naira(b.total)}</td>
                <td>${this.statusBadge(b.status)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel__head"><div><h3>What this dashboard still needs</h3>
          <p>Everything below must be built before any of it can be trusted</p></div></div>
        <div class="grid grid--3" style="gap:1rem">
          <div class="notice notice--ink" style="grid-template-columns:1fr"><p style="font-size:.8rem"><b>1 · A database.</b> PostgreSQL or MySQL with bookings, clients, enquiries, galleries, pricing and audit tables.</p></div>
          <div class="notice notice--ink" style="grid-template-columns:1fr"><p style="font-size:.8rem"><b>2 · An API.</b> Authenticated REST or GraphQL endpoints. The browser must never be trusted to self-report a status change.</p></div>
          <div class="notice notice--ink" style="grid-template-columns:1fr"><p style="font-size:.8rem"><b>3 · Real auth.</b> Server sessions, MFA for admin accounts, role-based permissions and session expiry.</p></div>
          <div class="notice notice--ink" style="grid-template-columns:1fr"><p style="font-size:.8rem"><b>4 · Webhooks.</b> Paystack payment events and email delivery events written to the database.</p></div>
          <div class="notice notice--ink" style="grid-template-columns:1fr"><p style="font-size:.8rem"><b>5 · File storage.</b> Object storage with signed URLs for portfolio images and private client galleries.</p></div>
          <div class="notice notice--ink" style="grid-template-columns:1fr"><p style="font-size:.8rem"><b>6 · Reporting.</b> Real aggregation queries rather than the hard-coded demonstration figures used here.</p></div>
        </div>
      </section>`;
  },

  /* ====================================================================== */
  /* VIEW: BOOKINGS                                                         */
  /* ====================================================================== */
  viewBookings() {
    const m = this.metrics();
    return `
      <div class="kpis">
        <div class="kpi"><span class="kpi__label">Pending</span><span class="kpi__value">${m.pending}</span>
          <span class="kpi__delta">awaiting confirmation</span></div>
        <div class="kpi"><span class="kpi__label">Confirmed</span><span class="kpi__value">${m.confirmed}</span>
          <span class="kpi__delta">${UTIL.naira(m.confirmedValue)}</span></div>
        <div class="kpi"><span class="kpi__label">Completed</span><span class="kpi__value">${m.completed}</span>
          <span class="kpi__delta">${UTIL.naira(m.completedValue)}</span></div>
        <div class="kpi"><span class="kpi__label">Cancelled</span><span class="kpi__value">${m.cancelled}</span>
          <span class="kpi__delta down">dates released</span></div>
      </div>

      <section class="panel">
        <div class="panel__head">
          <div><h2>All bookings</h2><p>Filter by status, open a record for full client detail</p></div>
          <div class="filters" id="bk-filter">
            <button class="filter-btn" type="button" data-status="all" aria-pressed="true">All (${m.total})</button>
            <button class="filter-btn" type="button" data-status="pending" aria-pressed="false">Pending (${m.pending})</button>
            <button class="filter-btn" type="button" data-status="confirmed" aria-pressed="false">Confirmed (${m.confirmed})</button>
            <button class="filter-btn" type="button" data-status="completed" aria-pressed="false">Completed (${m.completed})</button>
            <button class="filter-btn" type="button" data-status="cancelled" aria-pressed="false">Cancelled (${m.cancelled})</button>
          </div>
        </div>

        <div class="table-wrap">
          <table class="table" id="bk-table">
            <caption>Click any row to open the booking record — changes are not saved</caption>
            <thead><tr>
              <th scope="col">Reference</th><th scope="col">Client</th><th scope="col">Service / package</th>
              <th scope="col">Event date</th><th scope="col">Total</th><th scope="col">Deposit</th>
              <th scope="col">Status</th><th scope="col">Actions</th>
            </tr></thead>
            <tbody id="bk-body"></tbody>
          </table>
        </div>
        <p class="form-note">Client names, emails, telephone numbers and every price in this table are fictional
          demonstration values created for this prototype.</p>
      </section>

      <div id="bk-detail"></div>`;
  },

  paintBookings(status) {
    const body = $("#bk-body");
    if (!body) return;
    const list = this.data.bookings.filter(b => status === "all" || b.status === status);

    if (!list.length) {
      body.innerHTML = `<tr><td colspan="8">
        <div class="empty-state" style="padding:2.5rem 1rem;border:0">
          <p><b>No bookings with this status.</b></p>
          <p class="text--xs">This empty state is part of the demonstration. Use "+ New booking" to add one.</p>
        </div></td></tr>`;
      return;
    }

    body.innerHTML = list.map(b => `<tr data-ref="${b.ref}" style="cursor:pointer">
      <td><b>${b.ref}</b></td>
      <td>${UTIL.esc(b.client)}<br><span class="text--xs text--muted">${UTIL.esc(b.email)}</span></td>
      <td>${UTIL.esc(b.service)}<br><span class="text--xs text--muted">${UTIL.esc(b.pkg)}</span></td>
      <td>${UTIL.prettyDate(b.date)}<br><span class="text--xs text--muted">${b.time}</span></td>
      <td>${UTIL.naira(b.total)}</td>
      <td>${UTIL.naira(b.deposit)}</td>
      <td>${this.statusBadge(b.status)}</td>
      <td><div class="row-actions">
        <button class="mini-btn mini-btn--gold" type="button" data-open="${b.ref}">Open</button>
        <button class="mini-btn" type="button" data-advance="${b.ref}">Advance</button>
        <button class="mini-btn mini-btn--danger" type="button" data-cancel="${b.ref}">Cancel</button>
      </div></td></tr>`).join("");
  },

  openBooking(ref) {
    const b = this.data.bookings.find(x => x.ref === ref);
    if (!b) return;
    const host = $("#bk-detail");
    const flow = ["pending", "confirmed", "completed"];
    const idx = flow.indexOf(b.status);

    host.innerHTML = `
      <div class="detail-drawer" id="drawer-mask">
        <div class="detail-drawer__panel" role="dialog" aria-modal="true" aria-label="Booking ${b.ref}">
          <div style="display:flex;justify-content:space-between;gap:1rem;align-items:baseline">
            <div>
              <p class="eyebrow">Booking record</p>
              <h2 style="font-size:var(--step-2);margin-top:.4rem">${b.ref}</h2>
            </div>
            <button class="mini-btn" type="button" data-close-detail>Close</button>
          </div>

          <div class="stack stack--sm" style="font-size:.86rem">
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Client</span><b>${UTIL.esc(b.client)}</b></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Email</span><span>${UTIL.esc(b.email)}</span></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Telephone</span><span>${UTIL.esc(b.phone)}</span></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Service</span><b>${UTIL.esc(b.service)}</b></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Package</span><span>${UTIL.esc(b.pkg)}</span></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Event date</span><span>${UTIL.prettyDate(b.date)} · ${b.time}</span></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Location</span><span>${UTIL.esc(b.location)}</span></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Guests / subjects</span><span>${b.guests || "—"}</span></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Estimated total</span><b>${UTIL.naira(b.total)}</b></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Deposit (${CONFIG.commercial.depositPercent}%)</span><b>${UTIL.naira(b.deposit)}</b></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Outstanding balance</span><b>${UTIL.naira(b.total - b.deposit)}</b></div>
            <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
              <span class="text--muted">Current status</span>${this.statusBadge(b.status)}</div>
          </div>

          <div>
            <p class="text--xs text--muted" style="letter-spacing:.2em;text-transform:uppercase;margin-bottom:.7rem">Workflow</p>
            <div class="steps">
              <div class="step ${b.status === "pending" ? "is-active" : idx > 0 ? "is-done" : ""}"><span class="step__label">Enquiry</span></div>
              <div class="step ${b.status === "confirmed" ? "is-active" : idx > 1 ? "is-done" : ""}"><span class="step__label">Confirmed</span></div>
              <div class="step ${b.status === "completed" ? "is-active" : ""}"><span class="step__label">Delivered</span></div>
            </div>
          </div>

          <div style="display:flex;gap:.5rem;flex-wrap:wrap">
            <button class="mini-btn mini-btn--gold" type="button" data-advance="${b.ref}">Advance status</button>
            <button class="mini-btn mini-btn--danger" type="button" data-cancel="${b.ref}">Cancel booking</button>
            <button class="mini-btn" type="button" data-email="${UTIL.esc(b.email)}">Email client</button>
            <button class="mini-btn" type="button" data-close-detail>Close</button>
          </div>

          <div class="notice notice--warn" style="grid-template-columns:1fr">
            <p style="font-size:.76rem"><b>Not persisted.</b> This record exists only in browser memory. Reloading the
              page restores the original demonstration dataset. Emailing the client requires a transactional email
              service and a server-side endpoint.</p>
          </div>
        </div>
      </div>`;

    $("#drawer-mask").addEventListener("click", e => {
      if (e.target.id === "drawer-mask") host.innerHTML = "";
    });
  },

  /* ====================================================================== */
  /* VIEW: CALENDAR                                                         */
  /* ====================================================================== */
  viewCalendar() {
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    const first = new Date(year, month, 1);
    const start = first.getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    const byDate = {};
    this.data.bookings.forEach(b => {
      if (b.status === "cancelled") return;
      byDate[b.date] = byDate[b.date] || [];
      byDate[b.date].push(b);
    });

    const cells = [];
    for (let i = 0; i < start; i++) cells.push('<div class="cal__cell is-pad"></div>');
    for (let d = 1; d <= days; d++) {
      const iso = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
      const has = byDate[iso];
      cells.push(`<div class="cal__cell ${d === today ? "is-today" : ""} ${has ? "is-booked" : "is-free"}"
        title="${has ? UTIL.esc(has.map(b => b.client + " — " + b.service).join(", ")) : "Available"}"
        ${has ? 'data-cal-date="' + iso + '"' : ""}>
        ${d}${has ? '<span class="dot"></span>' : ""}</div>`);
    }

    const upcoming = [...this.data.bookings]
      .filter(b => b.status !== "cancelled" && new Date(b.date) >= new Date(now.toISOString().slice(0, 10)))
      .sort((a, b) => a.date < b.date ? -1 : 1).slice(0, 8);

    return `
      <div class="admin-grid admin-grid--2">
        <section class="panel">
          <div class="panel__head"><div>
            <h2>${first.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</h2>
            <p>${this.data.bookings.filter(b => b.status !== "cancelled").length} scheduled coverages — demonstration data</p>
          </div><span class="placeholder-tag">demo</span></div>
          <div class="cal">
            <div class="cal__head">${["S","M","T","W","T","F","S"].map(d => `<span>${d}</span>`).join("")}</div>
            <div class="cal__grid">${cells.join("")}</div>
          </div>
          <div class="stack--sm" style="display:grid;gap:.5rem;font-size:.76rem;color:var(--taupe);margin-top:.6rem">
            <span><span style="display:inline-block;width:8px;height:8px;background:var(--gold-deep);border-radius:50%;margin-right:.5rem"></span>Booked date</span>
            <span><span style="display:inline-block;width:8px;height:8px;border:1px solid var(--gold);border-radius:50%;margin-right:.5rem"></span>Today</span>
          </div>
        </section>

        <section class="panel">
          <div class="panel__head"><div><h3>Upcoming coverages</h3><p>Next eight scheduled events</p></div></div>
          <div class="table-wrap"><table class="table" style="min-width:0">
            <thead><tr><th scope="col">Date</th><th scope="col">Client</th><th scope="col">Service</th><th scope="col">Status</th></tr></thead>
            <tbody>${upcoming.length ? upcoming.map(b => `<tr>
              <td>${UTIL.prettyDate(b.date).replace(" " + year, "")}<br><span class="text--xs text--muted">${b.time}</span></td>
              <td>${UTIL.esc(b.client)}</td><td>${UTIL.esc(b.service)}</td><td>${this.statusBadge(b.status)}</td></tr>`).join("")
              : `<tr><td colspan="4"><div class="empty-state" style="padding:2rem 1rem;border:0">
                   <p class="text--xs"><b>No upcoming coverages.</b></p></div></td></tr>`}
            </tbody></table></div>
          <p class="form-note">Availability management needs a backend: real double-booking prevention, hold/release
            logic on unpaid enquiries, and iCal or Google Calendar synchronisation.</p>
        </section>
      </div>`;
  },

  /* ====================================================================== */
  /* VIEW: ENQUIRIES                                                        */
  /* ====================================================================== */
  viewEnquiries() {
    const counts = s => this.data.enquiries.filter(e => e.status === s).length;
    return `
      <section class="panel">
        <div class="panel__head">
          <div><h2>Enquiry management</h2><p>Website forms, WhatsApp and social messages</p></div>
          <div class="filters" id="eq-filter">
            <button class="filter-btn" type="button" data-status="all" aria-pressed="true">All</button>
            <button class="filter-btn" type="button" data-status="new" aria-pressed="false">New (${counts("new")})</button>
            <button class="filter-btn" type="button" data-status="replied" aria-pressed="false">Replied</button>
            <button class="filter-btn" type="button" data-status="quoted" aria-pressed="false">Quoted</button>
            <button class="filter-btn" type="button" data-status="closed" aria-pressed="false">Closed</button>
          </div>
        </div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">ID</th><th scope="col">From</th><th scope="col">Subject</th>
            <th scope="col">Channel</th><th scope="col">Received</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
          <tbody id="eq-body"></tbody>
        </table></div>
        <p class="form-note">Every enquirer name, email address and subject here is fictional demonstration content.</p>
      </section>`;
  },

  paintEnquiries(status) {
    const body = $("#eq-body");
    if (!body) return;
    const list = this.data.enquiries.filter(e => status === "all" || e.status === status);
    if (!list.length) {
      body.innerHTML = `<tr><td colspan="7"><div class="empty-state" style="padding:2.5rem 1rem;border:0">
        <p><b>No enquiries with this status.</b></p>
        <p class="text--xs">Another intentional empty state for the demonstration.</p></div></td></tr>`;
      return;
    }
    const next = { new: "replied", replied: "quoted", quoted: "closed", closed: "new" };
    body.innerHTML = list.map(e => `<tr>
      <td><b>${e.id}</b></td>
      <td>${UTIL.esc(e.name)}<br><span class="text--xs text--muted">${UTIL.esc(e.email)}</span></td>
      <td>${UTIL.esc(e.subject)}</td>
      <td>${UTIL.esc(e.channel)}</td>
      <td>${UTIL.prettyDate(e.date)}</td>
      <td>${this.statusBadge(e.status)}</td>
      <td><div class="row-actions">
        <button class="mini-btn mini-btn--gold" type="button" data-eq-next="${e.id}">Mark ${next[e.status]}</button>
        <button class="mini-btn" type="button" data-eq-open="${e.id}">Open</button>
      </div></td></tr>`).join("");
  },

  /* ====================================================================== */
  /* VIEW: SERVICES & PRICING                                               */
  /* ====================================================================== */
  viewServices() {
    return `
      <section class="panel">
        <div class="panel__head"><div><h2>Service &amp; price management</h2>
          <p>Edit illustrative package prices — changes apply for this session only</p></div>
          <span class="badge badge--pending">session only</span></div>

        <div class="table-wrap">
          <table class="table">
            <thead><tr><th scope="col">Service</th><th scope="col">Tier</th><th scope="col">Package</th>
              <th scope="col">Price (₦)</th><th scope="col">Photos</th><th scope="col">Timeline</th><th scope="col">Status</th></tr></thead>
            <tbody>
              ${CONFIG.services.map(s => s.packages.map((p, i) => `<tr>
                ${i === 0 ? `<th scope="row" rowspan="3">${UTIL.esc(s.name)}</th>` : ""}
                <td>${UTIL.esc(p.tier)}</td>
                <td>${UTIL.esc(p.name)}</td>
                <td><input class="price-input" type="number" step="1000" min="0" value="${p.price}"
                       data-price="${s.id}|${p.tier}" aria-label="Price for ${UTIL.esc(s.name)} ${UTIL.esc(p.tier)}"></td>
                <td>${p.photos}</td>
                <td>${UTIL.esc(p.timeline)}</td>
                <td>${this.statusBadge("published")}</td></tr>`).join("")).join("")}
            </tbody>
          </table>
        </div>

        <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.2rem">
          <button class="mini-btn mini-btn--gold" type="button" id="save-prices">Save changes</button>
          <button class="mini-btn" type="button" id="reset-prices">Reset</button>
        </div>
        <p class="form-note">Saving updates the in-memory copy only. In production this would write to a
          <code>packages</code> table through an authenticated API, with a revision history and an audit trail.</p>
      </section>

      <section class="panel">
        <div class="panel__head"><div><h3>Add-on price management</h3><p>Optional extras quoted alongside packages</p></div></div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">Add-on</th><th scope="col">Price (₦)</th><th scope="col">Note</th></tr></thead>
          <tbody>${CONFIG.addons.map(a => `<tr>
            <th scope="row">${UTIL.esc(a.name)}</th>
            <td><input class="price-input" type="number" step="1000" min="0" value="${a.price}" data-addon-price="${UTIL.esc(a.name)}"
                   aria-label="Price for ${UTIL.esc(a.name)}"></td>
            <td>${UTIL.esc(a.note)}</td></tr>`).join("")}</tbody>
        </table></div>
      </section>`;
  },

  /* ====================================================================== */
  /* VIEW: PORTFOLIO                                                        */
  /* ====================================================================== */
  viewPortfolio() {
    const count = c => CONFIG.portfolio.filter(p => p.c === c).length;
    return `
      <div class="admin-grid admin-grid--2">
        <section class="panel">
          <div class="panel__head"><div><h2>Collections</h2><p>Published image sets and their visibility</p></div>
            <button class="mini-btn mini-btn--gold" type="button" id="new-collection">+ New collection</button></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th scope="col">Collection</th><th scope="col">Images</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
            <tbody>${CONFIG.categories.filter(c => c.id !== "all").map(c => `<tr>
              <th scope="row">${UTIL.esc(c.label)} Photography</th>
              <td>${count(c.id)}</td>
              <td>${this.statusBadge("published")}</td>
              <td><div class="row-actions">
                <button class="mini-btn" type="button" data-open-collection="${c.id}">Open</button>
                <button class="mini-btn" type="button" data-hide-collection="${c.id}">Hide</button>
              </div></td></tr>`).join("")}</tbody>
          </table></div>
        </section>

        <section class="panel">
          <div class="panel__head"><div><h3>Project pages</h3><p>Case studies linked from the portfolio</p></div></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th scope="col">Project</th><th scope="col">Discipline</th><th scope="col">Status</th></tr></thead>
            <tbody>${CONFIG.projects.map(p => `<tr>
              <th scope="row"><a href="project.html?p=${p.id}" style="border-bottom:1px solid var(--line)">${UTIL.esc(p.title)}</a></th>
              <td>${UTIL.esc(p.category)}</td><td>${this.statusBadge("published")}</td></tr>`).join("")}</tbody>
          </table></div>
        </section>
      </div>

      <section class="panel">
        <div class="panel__head"><div><h2>Image library</h2>
          <p>Sample records showing the metadata that should accompany every asset</p></div></div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th scope="col">Preview</th><th scope="col">Suggested filename</th><th scope="col">ALT text</th>
            <th scope="col">Collection</th><th scope="col">Actions</th></tr></thead>
          <tbody>${CONFIG.portfolio.slice(0, 10).map((p, i) => {
            const cat = CONFIG.categories.find(c => c.id === p.c);
            const file = p.a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42);
            return `<tr>
              <td><img src="${CONFIG.img(p.id, 120, 120)}" alt="" width="56" height="56" loading="lazy" decoding="async"
                       style="width:56px;height:56px;object-fit:cover"></td>
              <td><code style="font-size:.74rem">${cat ? cat.label.toLowerCase().replace(/\s+/g, "-") : p.c}-${String(i + 1).padStart(2, "0")}-${file}.jpg</code></td>
              <td style="max-width:34ch;font-size:.8rem">${UTIL.esc(p.a)}</td>
              <td>${cat ? UTIL.esc(cat.label) : p.c}</td>
              <td><div class="row-actions">
                <button class="mini-btn" type="button" data-preview="${p.id}">Preview</button>
                <button class="mini-btn mini-btn--danger" type="button" data-remove="${p.id}">Remove</button>
              </div></td></tr>`;
          }).join("")}</tbody>
        </table></div>
        <p class="form-note">A real portfolio manager needs authenticated upload to object storage, automatic
          derivative generation, drag-and-drop ordering, bulk ALT editing and per-image licensing notes.</p>
      </section>`;
  },

  /* ====================================================================== */
  /* VIEW: REVENUE                                                          */
  /* ====================================================================== */
  viewRevenue() {
    const months = CONFIG.admin.revenue;
    const total = months.reduce((n, m) => n + m.v, 0);
    const avg = Math.round(total / months.length);
    const best = months.reduce((a, b) => (b.v > a.v ? b : a));
    const max = Math.max(...months.map(m => m.v));

    return `
      <div class="kpis">
        <div class="kpi"><span class="kpi__label">Trailing 12-month turnover</span><span class="kpi__value">${UTIL.naira(total)}</span>
          <span class="kpi__delta">fictional</span></div>
        <div class="kpi"><span class="kpi__label">Monthly average</span><span class="kpi__value">${UTIL.naira(avg)}</span>
          <span class="kpi__delta">illustrative</span></div>
        <div class="kpi"><span class="kpi__label">Best month</span><span class="kpi__value">${best.m}</span>
          <span class="kpi__delta">${UTIL.naira(best.v)}</span></div>
        <div class="kpi"><span class="kpi__label">Deposits held</span><span class="kpi__value">${UTIL.naira(this.metrics().depositsHeld)}</span>
          <span class="kpi__delta">not reconciled</span></div>
      </div>

      <section class="panel">
        <div class="panel__head"><div><h2>Monthly revenue</h2><p>Demonstration figures — no accounting source behind this</p></div>
          <span class="placeholder-tag">demo data</span></div>
        <div class="barchart">${months.map((m, i) => `
          <div class="barchart__col" title="${m.m}: ${UTIL.naira(m.v)}">
            <span class="barchart__val">${(m.v / 1000000).toFixed(1)}m</span>
            <div class="barchart__bar ${m === best ? "is-gold" : ""}" style="height:${Math.max(6, (m.v / max) * 100)}%;animation-delay:${i * 50}ms"></div>
            <span class="barchart__key">${m.m}</span></div>`).join("")}</div>
      </section>

      <div class="admin-grid admin-grid--2">
        <section class="panel">
          <div class="panel__head"><div><h3>Revenue by service line</h3><p>Illustrative share of turnover</p></div></div>
          <div class="mix-bar">${CONFIG.admin.serviceMix.map(s => `
            <div class="mix-row"><span>${s.label}</span>
              <span class="mix-row__track"><span class="mix-row__fill" style="display:block;width:${s.v * 2.2}%"></span></span>
              <b>${s.v}%</b></div>`).join("")}
          </div>
          <hr class="rule">
          <div class="stack--sm" style="display:grid;gap:.6rem;font-size:.84rem">
            ${CONFIG.admin.serviceMix.map(s => `
              <div style="display:flex;justify-content:space-between;gap:1rem">
                <span>${s.label}</span><b>${UTIL.naira(Math.round(total * s.v / 100))}</b></div>`).join("")}
          </div>
        </section>

        <section class="panel">
          <div class="panel__head"><div><h3>Outstanding balances</h3><p>Confirmed bookings not yet fully settled</p></div></div>
          <div class="table-wrap"><table class="table" style="min-width:0">
            <thead><tr><th scope="col">Ref</th><th scope="col">Client</th><th scope="col">Balance</th></tr></thead>
            <tbody>${this.data.bookings.filter(b => b.status === "confirmed").map(b => `<tr>
              <td>${b.ref}</td><td>${UTIL.esc(b.client)}</td><td><b>${UTIL.naira(b.total - b.deposit)}</b></td></tr>`).join("")}
            </tbody></table></div>
          <p class="form-note">Real reconciliation requires Paystack transaction data, bank statements and an
            accounting integration. Never present figures like these to a client as fact.</p>
        </section>
      </div>`;
  },

  /* ====================================================================== */
  /* VIEW: SETTINGS                                                         */
  /* ====================================================================== */
  viewSettings() {
    const c = CONFIG.commercial;
    return `
      <div class="admin-grid admin-grid--2">
        <section class="panel">
          <div class="panel__head"><div><h2>Commercial configuration</h2><p>Values read from <code>js/config.js</code></p></div></div>
          <div class="stack stack--sm" style="font-size:.88rem">
            ${[["Booking deposit", c.depositPercent + "% of total"],
               ["Balance due", c.balanceDueDays + " days before the event"],
               ["VAT", c.vatPercent + "%"],
               ["Travel included", c.travelIncludedKm + " km radius"],
               ["Minimum notice", c.minNoticeDays + " days"],
               ["Currency", c.currency.code + " (" + c.currency.symbol + ")"]].map(r => `
              <div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding-top:.6rem">
                <span class="text--muted">${r[0]}</span><b>${r[1]}</b></div>`).join("")}
          </div>
          <div class="notice" style="margin-top:1.2rem">
            <span class="notice__ico" aria-hidden="true">ℹ</span>
            <p style="font-size:.8rem">These are read-only here. Edit <code>CONFIG.commercial</code> in
              <code>js/config.js</code>. In production this screen would write to a settings table with validation
              and an audit log.</p>
          </div>
        </section>

        <section class="panel">
          <div class="panel__head"><div><h2>Integrations</h2><p>What is connected, and what is not</p></div></div>
          <div class="table-wrap"><table class="table" style="min-width:0">
            <thead><tr><th scope="col">Integration</th><th scope="col">Status</th><th scope="col">Required work</th></tr></thead>
            <tbody>
              <tr><th scope="row">Paystack</th><td>${c.payment.enabled ? this.statusBadge("published") : this.statusBadge("pending")}</td>
                <td>Server-side initialise + webhook signature verification</td></tr>
              <tr><th scope="row">Email notifications</th><td>${this.statusBadge("draft")}</td>
                <td>Transactional provider (Resend, Postmark) + templates</td></tr>
              <tr><th scope="row">Database</th><td>${this.statusBadge("draft")}</td>
                <td>PostgreSQL/MySQL schema and migrations</td></tr>
              <tr><th scope="row">Admin authentication</th><td>${this.statusBadge("draft")}</td>
                <td>Real sessions, MFA, role-based access</td></tr>
              <tr><th scope="row">Private galleries</th><td>${this.statusBadge("draft")}</td>
                <td>Signed expiring URLs + object storage</td></tr>
              <tr><th scope="row">Availability engine</th><td>${this.statusBadge("draft")}</td>
                <td>Double-booking prevention + calendar sync</td></tr>
              <tr><th scope="row">Analytics</th><td>${this.statusBadge("draft")}</td>
                <td>Privacy-respecting analytics + conversion tracking</td></tr>
            </tbody></table></div>
        </section>
      </div>

      <section class="panel">
        <div class="panel__head"><div><h2>Data &amp; compliance notice</h2><p>Read before going live</p></div></div>
        <div class="grid grid--3" style="gap:1rem">
          <div class="notice notice--warn" style="grid-template-columns:1fr"><p style="font-size:.8rem"><b>No persistence.</b>
            Nothing entered into this dashboard is stored. Refreshing the browser restores the original dataset.</div>
          <div class="notice notice--warn" style="grid-template-columns:1fr"><p style="font-size:.8rem"><b>No security.</b>
            The passcode is in the page source. Real admin routes must be authenticated server-side over HTTPS.</p></div>
          <div class="notice notice--warn" style="grid-template-columns:1fr"><p style="font-size:.8rem"><b>Fictional data.</b>
            Every client, enquiry, price and revenue figure is invented for demonstration purposes.</p></div>
        </div>
      </section>`;
  },

  /* ====================================================================== */
  /* Per-view action binding (event delegation)                             */
  /* ====================================================================== */
  bindViewActions(host) {
    // Delegated listeners live on the persistent host element, so bind only once.
    if (host.dataset.bound === "1") return;
    host.dataset.bound = "1";

    // Status filter — bookings
    const bkf = $("#bk-filter", host);
    if (bkf) {
      this.paintBookings("all");
      bkf.addEventListener("click", e => {
        const b = e.target.closest("[data-status]"); if (!b) return;
        $$("button", bkf).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        this.paintBookings(b.dataset.status);
      });
    }

    // Enquiry filter
    const eqf = $("#eq-filter", host);
    if (eqf) {
      this.paintEnquiries("all");
      eqf.addEventListener("click", e => {
        const b = e.target.closest("[data-status]"); if (!b) return;
        $$("button", eqf).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        this.paintEnquiries(b.dataset.status);
      });
    }

    // Row / detail actions
    host.addEventListener("click", e => {
      const open = e.target.closest("[data-open]");
      const adv  = e.target.closest("[data-advance]");
      const can  = e.target.closest("[data-cancel]");
      const close= e.target.closest("[data-close-detail]");
      const mail = e.target.closest("[data-email]");
      const goto = e.target.closest("[data-goto]");
      const eqN  = e.target.closest("[data-eq-next]");
      const eqO  = e.target.closest("[data-eq-open]");
      const prev = e.target.closest("[data-preview]");
      const coll = e.target.closest("[data-open-collection]");

      if (goto) { $$('#admin-nav [data-view="' + goto.dataset.goto + '"]')[0].click(); return; }
      if (close) { $("#bk-detail").innerHTML = ""; return; }
      if (open) { this.openBooking(open.dataset.open); return; }
      if (coll) { window.open("portfolio.html?c=" + coll.dataset.openCollection, "_blank"); return; }
      if (prev) {
        APP.openLightbox([{ src: CONFIG.img(prev.dataset.preview, 1500), thumb: CONFIG.img(prev.dataset.preview, 200, 200),
          srcset: CONFIG.imgSet(prev.dataset.preview), title: "Preview", caption: "Demonstration image record" }], 0);
        return;
      }
      if (mail) { APP.toast("Email requires a transactional email service — not configured in this demo", "err"); return; }
      if (eqO) { APP.toast("Opening an enquiry needs a detail view backed by stored data"); return; }

      if (adv) {
        const b = this.data.bookings.find(x => x.ref === adv.dataset.advance);
        if (b) {
          const flow = ["pending", "confirmed", "completed"];
          const i = flow.indexOf(b.status);
          b.status = i < 0 || i === flow.length - 1 ? "completed" : flow[i + 1];
          this.render();
          APP.toast(b.ref + " → " + b.status + " (in-memory only)");
        }
        return;
      }
      if (can) {
        const b = this.data.bookings.find(x => x.ref === can.dataset.cancel);
        if (b) {
          b.status = b.status === "cancelled" ? "pending" : "cancelled";
          this.render();
          APP.toast(b.ref + " → " + b.status + " (in-memory only)");
        }
        return;
      }
      if (eqN) {
        const en = this.data.enquiries.find(x => x.id === eqN.dataset.eqNext);
        if (en) {
          const next = { new: "replied", replied: "quoted", quoted: "closed", closed: "new" };
          en.status = next[en.status];
          this.paintEnquiries($(".filter-btn[aria-pressed=true]", $("#eq-filter"))?.dataset.status || "all");
          $("[data-count=enquiries]").textContent = this.data.enquiries.filter(x => x.status === "new").length;
          APP.toast(en.id + " → " + en.status);
        }
        return;
      }
    });

    // Price save / reset
    const save = $("#save-prices", host);
    if (save) {
      save.addEventListener("click", () => {
        let n = 0;
        $$("[data-price]", host).forEach(inp => {
          const [sid, tier] = inp.dataset.price.split("|");
          const svc = UTIL.service(sid); if (!svc) return;
          const pkg = svc.packages.find(p => p.tier === tier); if (!pkg) return;
          const v = Number(inp.value);
          if (!isNaN(v) && v >= 0 && v !== pkg.price) { pkg.price = v; n++; }
        });
        $$("[data-addon-price]", host).forEach(inp => {
          const a = CONFIG.addons.find(x => x.name === inp.dataset.addonPrice); if (!a) return;
          const v = Number(inp.value);
          if (!isNaN(v) && v >= 0 && v !== a.price) { a.price = v; n++; }
        });
        APP.toast(n ? n + " price(s) updated for this session — not persisted" : "No changes detected");
      });
      $("#reset-prices", host).addEventListener("click", () => { this.render(); APP.toast("Prices reset to defaults"); });
    }

    // Portfolio actions
    const newColl = $("#new-collection", host);
    if (newColl) newColl.addEventListener("click", () =>
      APP.toast("Creating a collection requires an authenticated API and image storage"));
    $$("[data-hide-collection]", host).forEach(b => b.addEventListener("click", () =>
      APP.toast("Visibility changes need a database — nothing was hidden")));
    $$("[data-remove]", host).forEach(b => b.addEventListener("click", () =>
      APP.toast("Removing assets needs an authenticated API — nothing was deleted")));
  },
};

document.addEventListener("DOMContentLoaded", () => ADMIN.boot());
