/* ==========================================================================
   TheDavidEze Photography — BOOKING SYSTEM (frontend demonstration)
   Studio: TheVials Services
   --------------------------------------------------------------------------
   A three-step wizard: service + package → date & details → review & submit.
   Everything runs in the browser. NO data leaves the device.

   ⚠️  BACKEND INTEGRATION REQUIRED FOR PRODUCTION
   ------------------------------------------------
   • POST the payload to a real API so bookings persist in a database.
   • Server-side availability checking (double-booking prevention).
   • Transactional email notifications to client + studio (Resend / Postmark).
   • Real payment confirmation webhook (Paystack) before showing a receipt.
   • Authenticated admin area to manage statuses and pricing.
   • Rate limiting, spam protection (honeypot / Turnstile) and GDPR consent log.
   ========================================================================== */

const PAGE = {

  state: {
    step: 1,
    service: null,
    tier: null,
    addons: [],
    submitted: null,
  },

  /* ====================================================================== */
  init() {
    if (document.body.dataset.page !== "booking") return;
    this.$form   = $("#booking-form");
    this.$sum    = $("#summary-rows");
    this.$rev    = $("#review-table tbody");
    this.$confirm= $("#confirm");

    // Minimum-notice and past-date guard
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const min   = new Date(today); min.setDate(min.getDate() + CONFIG.commercial.minNoticeDays);
    const $d = $("#bk-date");
    $d.min = today.toISOString().slice(0, 10);
    $("#notice-days").textContent = CONFIG.commercial.minNoticeDays;

    this.buildServiceChips();
    this.buildAddons();

    // Deep links: booking.html?service=wedding&package=Luxury
    const sParam = UTIL.param("service"), tParam = UTIL.param("package");
    if (sParam && UTIL.service(sParam)) {
      this.state.service = sParam;
      if (tParam && UTIL.pkg(sParam, tParam)) this.state.tier = tParam;
      this.buildPackageChips();
    }

    // Character counter
    const brief = $("#bk-brief");
    brief.addEventListener("input", () => $("#brief-count").textContent = brief.value.length);

    // WhatsApp link (editable number in CONFIG)
    const wa = $("#wa-link");
    const msg = encodeURIComponent("Hello TheDavidEze Photography — I'd like to enquire about a booking.");
    wa.href = "https://wa.me/" + CONFIG.contact.whatsapp + "?text=" + msg;

    this.bindNav();
    this.bindSubmit();
    this.render();
  },

  /* ====================================================================== */
  /* Step 1 — service, package and add-on chips                            */
  /* ====================================================================== */
  buildServiceChips() {
    $("#service-chips").innerHTML = CONFIG.services.map(s => `
      <label class="chip chip--wide" for="svc-${s.id}">
        <input type="radio" name="service" id="svc-${s.id}" value="${s.id}"
               ${this.state.service === s.id ? "checked" : ""}>
        <span class="chip__mark" aria-hidden="true"></span>
        <span class="chip__body">
          <span class="chip__title">${UTIL.esc(s.name)}</span>
          <span class="chip__meta">${UTIL.esc(s.duration)} · from ${UTIL.naira(s.packages[0].price)}</span>
        </span>
      </label>`).join("");

    $("#service-chips").addEventListener("change", e => {
      this.state.service = e.target.value;
      this.state.tier = null;
      this.buildPackageChips();
      this.render();
    });
  },

  buildPackageChips() {
    const s = UTIL.service(this.state.service);
    const box = $("#package-chips");
    if (!s) {
      box.innerHTML = `<div class="empty-state" style="padding:2rem 1rem">
        <p class="text--xs">No packages to show yet — select a service first.</p></div>`;
      $("#package-note").textContent = "Choose a service above to see its packages.";
      return;
    }
    $("#package-note").textContent =
      "Packages for " + s.name + ". Prices are illustrative and not confirmed client rates.";

    box.innerHTML = s.packages.map(p => `
      <label class="chip chip--wide" for="pkg-${s.id}-${p.tier}">
        <input type="radio" name="package" id="pkg-${s.id}-${p.tier}" value="${p.tier}"
               ${this.state.tier === p.tier ? "checked" : ""}>
        <span class="chip__mark" aria-hidden="true"></span>
        <span class="chip__body">
          <span class="chip__title">${UTIL.esc(p.name)} <span class="placeholder-tag">${UTIL.esc(p.tier)}</span></span>
          <span class="chip__meta">${UTIL.esc(p.coverage)} · ~${p.photos} photographs · ${UTIL.esc(p.timeline)}</span>
        </span>
        <span class="chip__price">${UTIL.naira(p.price)}</span>
      </label>`).join("");

    box.addEventListener("change", e => {
      this.state.tier = e.target.value;
      this.render();
    });
  },

  buildAddons() {
    $("#addon-chips").innerHTML = CONFIG.addons.map((a, i) => `
      <label class="chip chip--wide" for="addon-${i}">
        <input type="checkbox" name="addon" id="addon-${i}" value="${UTIL.esc(a.name)}" data-price="${a.price}">
        <span class="chip__mark" aria-hidden="true"></span>
        <span class="chip__body">
          <span class="chip__title">${UTIL.esc(a.name)}</span>
          <span class="chip__meta">${UTIL.esc(a.note)}</span>
        </span>
        <span class="chip__price">+${UTIL.naira(a.price)}</span>
      </label>`).join("");

    $("#addon-chips").addEventListener("change", e => {
      const checked = $$("#addon-chips input:checked");
      this.state.addons = checked.map(c => ({ name: c.value, price: +c.dataset.price }));
      this.render();
    });
  },

  /* ====================================================================== */
  /* Pricing maths — all values editable in CONFIG.commercial              */
  /* ====================================================================== */
  totals() {
    const s = UTIL.service(this.state.service);
    const p = s ? UTIL.pkg(s.id, this.state.tier) : null;
    const base = p ? p.price : 0;
    const extras = this.state.addons.reduce((n, a) => n + a.price, 0);
    const total = base + extras;
    const deposit = UTIL.deposit(total);
    return { s, p, base, extras, total, deposit, balance: total - deposit };
  },

  /* ====================================================================== */
  /* Live summary + review table                                           */
  /* ====================================================================== */
  render() {
    const t = this.totals();
    const f = new FormData(this.$form);
    const name = f.get("name") || "", email = f.get("email") || "",
          phone = f.get("phone") || "", loc = f.get("location") || "",
          date = f.get("date") || "", time = f.get("time") || "",
          guests = f.get("guests") || "—", brief = f.get("brief") || "—";

    const row = (k, v) => `<div class="summary__row"><span>${k}</span><span>${v}</span></div>`;

    this.$sum.innerHTML =
      row("Service", t.s ? UTIL.esc(t.s.name) : "<em style='opacity:.5'>Not selected</em>") +
      row("Package", t.p ? UTIL.esc(t.p.tier) + " — " + UTIL.esc(t.p.name) : "<em style='opacity:.5'>Not selected</em>") +
      row("Coverage", t.p ? UTIL.esc(t.p.coverage) : "—") +
      row("Photographs", t.p ? "~" + t.p.photos + " edited" : "—") +
      (this.state.addons.length
        ? row("Add-ons (" + this.state.addons.length + ")", this.state.addons.map(a => UTIL.esc(a.name)).join("<br>"))
        : row("Add-ons", "<em style='opacity:.5'>None selected</em>")) +
      row("Date", date ? UTIL.prettyDate(date) : "—") +
      row("Start time", time || "—") +
      row("Location", loc ? UTIL.esc(loc) : "—") +
      row("Package price", t.base ? UTIL.naira(t.base) : "—") +
      (t.extras ? row("Add-on subtotal", UTIL.naira(t.extras)) : "") +
      row("Estimated total", t.total ? UTIL.naira(t.total) : "<em style='opacity:.5'>—</em>") +
      row("Booking deposit (" + CONFIG.commercial.depositPercent + "%)", t.total ? UTIL.naira(t.deposit) : "—") +
      `<div class="summary__row summary__row--total"><span>Balance due</span><span>${t.total ? UTIL.naira(t.balance) : "—"}</span></div>`;

    // Review table (step 3)
    if (this.$rev) {
      const tr = (k, v) => `<tr><th scope="row" style="width:38%">${k}</th><td>${v}</td></tr>`;
      this.$rev.innerHTML =
        tr("Service", t.s ? UTIL.esc(t.s.name) : "—") +
        tr("Package", t.p ? UTIL.esc(t.p.tier) + " — " + UTIL.esc(t.p.name) : "—") +
        tr("Coverage period", t.p ? UTIL.esc(t.p.coverage) : "—") +
        tr("Edited photographs", t.p ? "Approximately " + t.p.photos : "—") +
        tr("Deliverables", t.p ? t.p.deliverables.map(d => UTIL.esc(d)).join("<br>") : "—") +
        tr("Delivery timeline", t.p ? UTIL.esc(t.p.timeline) : "—") +
        tr("Add-ons", this.state.addons.length
            ? this.state.addons.map(a => UTIL.esc(a.name) + " — " + UTIL.naira(a.price)).join("<br>")
            : "None") +
        tr("Preferred date", date ? UTIL.prettyDate(date) : "—") +
        tr("Preferred time", time || "—") +
        tr("Client name", name ? UTIL.esc(name) : "—") +
        tr("Email", email ? UTIL.esc(email) : "—") +
        tr("Telephone", phone ? UTIL.esc(phone) : "—") +
        tr("Guests / subjects", UTIL.esc(guests)) +
        tr("Event location", loc ? UTIL.esc(loc) : "—") +
        tr("Description", brief && brief !== "—" ? UTIL.esc(brief) : "—") +
        tr("Estimated total", "<b>" + (t.total ? UTIL.naira(t.total) : "—") + "</b> <span class='placeholder-tag'>illustrative</span>") +
        tr("Booking deposit (" + CONFIG.commercial.depositPercent + "%)", "<b>" + (t.total ? UTIL.naira(t.deposit) : "—") + "</b>") +
        tr("Balance due", "<b>" + (t.total ? UTIL.naira(t.balance) : "—") + "</b>");
    }

    // Enable/disable the payment shortcut
    const pay = $("#sum-pay");
    if (this.state.submitted) {
      pay.classList.remove("is-disabled");
      pay.removeAttribute("aria-disabled");
      pay.removeAttribute("tabindex");
      pay.href = "payment.html";
      $("#sum-pay-note").innerHTML = "Reference <b>" + this.state.submitted.ref + "</b> — continue to the deposit page.";
    }
  },

  /* ====================================================================== */
  /* Wizard navigation with validation                                     */
  /* ====================================================================== */
  bindNav() {
    const go = (n) => {
      if (n > this.state.step && !this.validate(this.state.step)) return;
      this.state.step = Math.max(1, Math.min(3, n));
      $$("[data-panel]").forEach(p => p.classList.toggle("is-active", +p.dataset.panel === this.state.step));
      $$("[data-step]").forEach(s => {
        const v = +s.dataset.step;
        s.classList.toggle("is-active", v === this.state.step);
        s.classList.toggle("is-done", v < this.state.step);
      });
      const prev = $("[data-prev]");
      if (this.state.step === 1) { prev.setAttribute("is-disabled", ""); prev.disabled = true; }
      else { prev.removeAttribute("is-disabled"); prev.disabled = false; }
      $("[data-next]").classList.toggle("is-hidden", this.state.step === 3);
      $("[data-submit]").classList.toggle("is-hidden", this.state.step !== 3);
      window.scrollTo({ top: $("#steps").getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
    };

    $("[data-next]").addEventListener("click", () => go(this.state.step + 1));
    $("[data-prev]").addEventListener("click", () => go(this.state.step - 1));

    // Enter advances the wizard (but not from a textarea)
    this.$form.addEventListener("keydown", e => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && !e.target.matches('button[type="submit"]')) {
        e.preventDefault();
        go(this.state.step + 1);
      }
    });

    go(1);
  },

  /* Validate the fields belonging to a given step. Returns boolean. */
  validate(step) {
    let ok = true;
    const fail = (key, msg) => {
      const field = $('[data-field="' + key + '"]');
      if (!field) return;
      field.classList.add("is-invalid");
      const err = $(".field__error", field);
      if (err) err.textContent = msg;
      const input = $("input,select,textarea", field);
      if (input) input.setAttribute("aria-invalid", "true");
      ok = false;
    };
    const clear = (key) => {
      const field = $('[data-field="' + key + '"]');
      if (!field) return;
      field.classList.remove("is-invalid");
      const err = $(".field__error", field);
      if (err) err.textContent = "";
    };

    if (step === 1) {
      if (!this.state.service || !this.state.tier) {
        APP.toast("Please select a service and a package to continue.", "err");
        if (!this.state.service) $("#service-chips").scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      return true;
    }

    if (step === 2) {
      ["date", "time", "name", "email", "phone", "location", "brief", "consent"].forEach(clear);
      const f = new FormData(this.$form);

      // Date: required, not in the past
      const d = f.get("date");
      if (!d) fail("date", "Please choose a preferred date.");
      else {
        const chosen = new Date(d + "T00:00:00");
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (isNaN(chosen)) fail("date", "That date could not be read. Please re-select it.");
        else if (chosen < today) fail("date", "Past dates cannot be selected. Please choose a future date.");
      }

      if (!f.get("time")) fail("time", "Please choose a preferred start time.");

      const name = (f.get("name") || "").trim();
      if (!name) fail("name", "Please enter your full name.");
      else if (name.length < 2) fail("name", "That name looks too short.");

      const email = (f.get("email") || "").trim();
      if (!email) fail("email", "Please enter your email address.");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail("email", "Please enter a valid email address.");

      const phone = (f.get("phone") || "").trim();
      if (!phone) fail("phone", "Please enter a telephone number.");
      else if (phone.replace(/\D/g, "").length < 7) fail("phone", "Please enter a valid telephone number.");

      const loc = (f.get("location") || "").trim();
      if (!loc) fail("location", "Please tell us where the event takes place.");
      else if (loc.length < 3) fail("location", "Please give a venue, area or city.");

      if (!f.get("consent")) fail("consent", "Please confirm you understand that a request is not a confirmed booking.");

      if (!ok) {
        APP.toast("Please correct the highlighted fields.", "err");
        const firstBad = $(".is-invalid input, .is-invalid textarea");
        if (firstBad) firstBad.focus({ preventScroll: false }), firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return ok;
    }
    return true;
  },

  /* ====================================================================== */
  /* Submission                                                            */
  /* ====================================================================== */
  bindSubmit() {
    this.$form.addEventListener("submit", e => {
      e.preventDefault();

      if (!this.validate(1)) { this.state.step = 1; }
      if (!this.validate(2)) { this.state.step = 2; }
      if (!this.state.service || !this.state.tier || !this.validate(2)) {
        $$("[data-panel]").forEach(p => p.classList.toggle("is-active", +p.dataset.panel === this.state.step));
        return;
      }

      const btn = $("[data-submit]");
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="loader" aria-hidden="true"></span> Submitting';

      const t = this.totals();
      const f = new FormData(this.$form);
      const payload = {
        ref: UTIL.makeRef(),
        service: t.s.name, serviceId: t.s.id,
        package: t.p.tier + " — " + t.p.name,
        coverage: t.p.coverage, photos: t.p.photos,
        deliverables: t.p.deliverables, timeline: t.p.timeline,
        addons: this.state.addons,
        date: f.get("date"), time: f.get("time"),
        name: f.get("name"), email: f.get("email"), phone: f.get("phone"),
        guests: f.get("guests") || null, location: f.get("location"),
        brief: f.get("brief") || null,
        base: t.base, extras: t.extras, total: t.total,
        deposit: t.deposit, balance: t.balance,
        depositPercent: CONFIG.commercial.depositPercent,
        submittedAt: new Date().toISOString(),
        status: "enquiry-received (demo)",
      };

      // Simulated network latency — purely presentational.
      setTimeout(() => {
        btn.disabled = false; btn.innerHTML = original;
        this.state.submitted = payload;

        // Persist to sessionStorage so payment.html can read it.
        // NOTE: sessionStorage is browser-local and is NOT a database.
        try { sessionStorage.setItem("tde_booking", JSON.stringify(payload)); }
        catch (err) { /* storage may be unavailable — the demo still works */ }

        this.showConfirmation(payload);
        this.render();
        APP.toast("Booking request captured in this demonstration");
      }, 1250);
    });
  },

  /* ====================================================================== */
  /* Confirmation screen                                                   */
  /* ====================================================================== */
  showConfirmation(p) {
    this.$form.classList.add("is-hidden");
    $("#steps").classList.add("is-hidden");

    this.$confirm.classList.remove("is-hidden");
    this.$confirm.innerHTML = `
      <span class="confirm__seal" aria-hidden="true">
        <svg width="30" height="22" viewBox="0 0 30 22" fill="none" stroke="currentColor" stroke-width="1.3">
          <path d="M2 11.5 11 20 28 2"/></svg>
      </span>
      <p class="eyebrow eyebrow--plain">Request captured</p>
      <h2 style="font-size:var(--step-3);max-width:22ch">Thank you, ${UTIL.esc((p.name || "").split(" ")[0])}.</h2>
      <p class="lead" style="margin-inline:auto;max-width:48ch">
        Your booking request has been captured by this demonstration interface.
      </p>
      <div>
        <p class="text--xs text--muted" style="letter-spacing:.2em;text-transform:uppercase">Booking reference (demonstration)</p>
        <p class="confirm__ref" style="margin-top:.6rem">${p.ref}</p>
      </div>
      <div class="table-wrap" style="width:100%">
        <table class="table" style="min-width:0">
          <caption>Your request at a glance</caption>
          <tbody>
            <tr><th scope="row">Service</th><td>${UTIL.esc(p.service)}</td></tr>
            <tr><th scope="row">Package</th><td>${UTIL.esc(p.package)}</td></tr>
            <tr><th scope="row">Preferred date</th><td>${UTIL.prettyDate(p.date)} at ${UTIL.esc(p.time)}</td></tr>
            <tr><th scope="row">Location</th><td>${UTIL.esc(p.location)}</td></tr>
            <tr><th scope="row">Estimated total</th><td><b>${UTIL.naira(p.total)}</b> <span class="placeholder-tag">illustrative</span></td></tr>
            <tr><th scope="row">Deposit due (${p.depositPercent}%)</th><td><b>${UTIL.naira(p.deposit)}</b></td></tr>
            <tr><th scope="row">Balance</th><td><b>${UTIL.naira(p.balance)}</b></td></tr>
          </tbody>
        </table>
      </div>
      <div class="notice notice--warn" style="text-align:left;max-width:none">
        <span class="notice__ico" aria-hidden="true">!</span>
        <p><b>What has actually happened:</b> nothing has been sent or saved on a server. This confirmation exists
           only in your browser for this session. A real deployment needs an API endpoint, a database, and email
           notifications before a client should be told their request was received.</p>
      </div>
      <div class="hero__actions" style="justify-content:center">
        <a class="btn btn--gold" href="payment.html">Continue to payment</a>
        <a class="btn btn--outline" href="faq.html">Read what happens next</a>
      </div>
      <button class="btn btn--outline btn--sm" type="button" id="reset-booking">Start a new request</button>
      <p class="form-note">Keep a note of your reference. In production it would be emailed to you and appear in your client area.</p>`;

    this.$confirm.scrollIntoView({ behavior: "smooth", block: "start" });

    const reset = $("#reset-booking");
    if (reset) reset.addEventListener("click", () => {
      try { sessionStorage.removeItem("tde_booking"); } catch (e) {}
      location.reload();
    });
  },
};
