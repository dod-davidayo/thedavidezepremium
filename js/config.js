/* ==========================================================================
   TheDavidEze Photography — SITE CONFIGURATION
   Studio: TheVials Services
   --------------------------------------------------------------------------
   ⚠️  THIS IS THE ONLY FILE YOU NEED TO EDIT TO CHANGE CONTENT.
   Everything below is editable. Anything marked [PLACEHOLDER] is unconfirmed
   demonstration content and must be replaced with real information before
   the website goes live.
   --------------------------------------------------------------------------
   CONTENTS
   01. Brand & contact
   02. SEO defaults & location placeholders
   03. Commercial configuration (deposit %, VAT, currency)
   04. Image helper
   05. Collections
   06. Services, packages & prices (₦ — ILLUSTRATIVE ONLY)
   07. Add-ons
   08. Portfolio images
   09. Project case studies
   10. Testimonials (DEMONSTRATION)
   11. FAQ
   12. Policies & process
   13. Admin demo dataset
   ========================================================================== */

const CONFIG = {

  /* 01. BRAND & CONTACT -------------------------------------------------- */
  brand: {
    name: "TheDavidEze Photography",
    shortName: "TheDavidEze",
    legalName: "TheDavidEze Photography",                 // [PLACEHOLDER] registered business name
    tagline: "Photography & Visual Storytelling",
    established: "2016",                                   // [PLACEHOLDER] year founded
    description:
      "TheDavidEze Photography is a premium photography studio creating refined, editorial imagery " +
      "for weddings, portraits, fashion, events and brands. Built by TheVials Services as a " +
      "high-end client demonstration.",
    logoInitials: "DE",
    builtBy: "TheVials Services",
    builtByURL: "#",                                       // [PLACEHOLDER] link to TheVials Services website
  },

  contact: {
    // [PLACEHOLDER] — no real contact details are invented anywhere in this build.
    email: "hello@thedavideze.example",                    // [PLACEHOLDER] replace with real email
    phoneDisplay: "+234 000 000 0000",                     // [PLACEHOLDER] replace with real phone
    phoneRaw: "2340000000000",                             // [PLACEHOLDER] digits only, for tel:/wa.me
    whatsapp: "2340000000000",                             // [PLACEHOLDER] digits only, international format
    addressLine1: "[Street Address — PLACEHOLDER]",
    addressLine2: "[City, State — PLACEHOLDER]",
    city: "[CITY]",                                        // location-specific SEO placeholder
    region: "[STATE]",
    country: "Nigeria",
    postalCode: "[POSTAL CODE]",
    mapEmbedURL: "",                                       // [PLACEHOLDER] Google Maps embed URL
    mapLink: "#",                                          // [PLACEHOLDER] link to Google Maps listing
    geo: { latitude: "", longitude: "" },                  // [PLACEHOLDER] for LocalBusiness schema
    hours: [
      { day: "Monday – Friday", time: "09:00 — 18:00" },
      { day: "Saturday", time: "10:00 — 16:00 (shoot days by appointment)" },
      { day: "Sunday", time: "Closed — event coverage only" },
    ],
    social: [
      { name: "Instagram", handle: "@thedavideze", url: "#", abbr: "IG" },   // [PLACEHOLDER]
      { name: "Facebook", handle: "TheDavidEze Photography", url: "#", abbr: "FB" }, // [PLACEHOLDER]
      { name: "X", handle: "@thedavideze", url: "#", abbr: "X" },            // [PLACEHOLDER]
      { name: "LinkedIn", handle: "TheDavidEze Photography", url: "#", abbr: "IN" }, // [PLACEHOLDER]
      { name: "TikTok", handle: "@thedavideze", url: "#", abbr: "TT" },      // [PLACEHOLDER]
    ],
  },

  /* 02. SEO -------------------------------------------------------------- */
  seo: {
    siteName: "TheDavidEze Photography",
    canonicalBase: "https://www.thedavideze.example",       // [PLACEHOLDER] replace with live domain
    themeColor: "#0B0B0B",
    twitter: "@thedavideze",                                // [PLACEHOLDER]
    ogImage: "images/og-cover.jpg",                         // [PLACEHOLDER] 1200x630 social share image
    // Location-specific keyword placeholders. Replace [CITY] consistently across
    // every page's title, meta description and H1 once the operating city is confirmed.
    locationKeywords: {
      photographer: "Photographer in [CITY]",
      wedding: "Wedding Photographer in [CITY]",
      event: "Event Photographer in [CITY]",
      portrait: "Portrait Photographer in [CITY]",
      commercial: "Commercial Photographer in [CITY]",
    },
  },

  /* 03. COMMERCIAL CONFIGURATION ----------------------------------------- */
  commercial: {
    currency: { code: "NGN", symbol: "₦", locale: "en-NG" },
    depositPercent: 40,          // EDITABLE — booking deposit as % of package price
    balanceDueDays: 7,           // EDITABLE — balance due N days before the event
    vatPercent: 0,               // EDITABLE — set 7.5 for Nigerian VAT if applicable
    travelIncludedKm: 50,        // EDITABLE — travel included within this radius
    minNoticeDays: 7,            // EDITABLE — minimum booking notice
    payment: {
      provider: "Paystack",                       // prepared integration
      publicKey: "pk_test_REPLACE_WITH_YOUR_KEY", // [PLACEHOLDER] — Paystack public key
      enabled: false,                             // flip to true once keys + backend exist
      bankTransferNote:
        "Bank transfer details will be shared privately once your booking is confirmed.",
    },
    priceDisclaimer:
      "All prices shown are illustrative demonstration figures for this prototype and are not confirmed " +
      "client rates. Final quotations depend on the event, location, duration and specific requirements.",
  },

  /* 04. IMAGE HELPER ----------------------------------------------------- */
  // Generates responsive Pexels CDN URLs + srcset. Swap for local files by
  // replacing `img()` with your own asset paths (e.g. /images/wedding-01.jpg).
  img: function (id, w, h) {
    let u = "https://images.pexels.com/photos/" + id + "/pexels-photo-" + id + ".jpeg?auto=compress&cs=tinysrgb&w=" + w;
    if (h) u += "&h=" + h + "&fit=crop";
    return u;
  },
  imgSet: function (id, h) {
    const base = "https://images.pexels.com/photos/" + id + "/pexels-photo-" + id + ".jpeg";
    const q = (w) => base + "?auto=compress&cs=tinysrgb&w=" + w;
    return q(480) + " 480w, " + q(760) + " 760w, " + q(1100) + " 1100w, " + q(1500) + " 1500w";
  },

  /* 05. COLLECTIONS ------------------------------------------------------ */
  collections: [
    { id: "weddings", title: "Weddings", cat: "Wedding Photography", count: "48 stories",
      img: 36725414, ratio: "frame--ratio-4x5", href: "portfolio.html?c=weddings",
      blurb: "Quiet, luminous coverage of the day as it truly unfolds." },
    { id: "portraits", title: "Portraits", cat: "Portrait Photography", count: "120+ sittings",
      img: 28863302, ratio: "frame--ratio-3x4", href: "portfolio.html?c=portraits",
      blurb: "Studio and natural-light portraiture with editorial restraint." },
    { id: "fashion", title: "Fashion & Editorial", cat: "Fashion Photography", count: "26 editorials",
      img: 33714925, ratio: "frame--ratio-4x5", href: "portfolio.html?c=fashion",
      blurb: "Direction, light and styling built for print and campaign." },
    { id: "events", title: "Events", cat: "Event Photography", count: "65 celebrations",
      img: 19203827, ratio: "frame--ratio-3x4", href: "portfolio.html?c=events",
      blurb: "Birthdays, galas and cultural milestones, discreetly captured." },
    { id: "lifestyle", title: "Lifestyle", cat: "Lifestyle Photography", count: "34 sessions",
      img: 33769352, ratio: "frame--ratio-4x5", href: "portfolio.html?c=lifestyle",
      blurb: "Unposed family and personal imagery with warmth and texture." },
    { id: "commercial", title: "Commercial", cat: "Commercial Photography", count: "41 brands",
      img: 37900999, ratio: "frame--ratio-3x4", href: "portfolio.html?c=commercial",
      blurb: "Product, brand and campaign imagery engineered to convert." },
  ],

  /* 06. SERVICES, PACKAGES & PRICES -------------------------------------- */
  // ⚠️ ALL PRICES ARE ILLUSTRATIVE DEMONSTRATION FIGURES — NOT CONFIRMED RATES.
  services: [
    {
      id: "wedding",
      name: "Wedding Photography",
      slug: "wedding-photography",
      short: "Full-day documentary coverage of your ceremony and celebration.",
      intro: "Unobtrusive, light-led coverage from preparation to the last dance. We work as a quiet presence in the room, building a complete visual record that still feels like a private memory.",
      img: 36862797, alt: "Bride and groom in formal attire posing outdoors during a warm sunset",
      duration: "10 – 12 hours",
      deliverables: ["Private online gallery", "High-resolution JPEG set", "Web-optimised set for sharing", "Print release", "Pre-wedding consultation"],
      timeline: "Preview set within 48 hours · Full gallery in 3 – 4 weeks",
      popular: true,
      packages: [
        { tier: "Essential", name: "Essential Ceremony", price: 450000, coverage: "6 hours continuous coverage", photos: 250,
          deliverables: ["One lead photographer", "Private online gallery", "High-res JPEG download", "Softcover proof magazine (20 pages)"],
          timeline: "3 weeks", addons: ["Second photographer", "Engagement session", "Album upgrade"] },
        { tier: "Signature", name: "Signature Celebration", price: 750000, coverage: "10 hours continuous coverage", photos: 500,
          deliverables: ["Lead photographer + assistant", "Highlight set within 48 hours", "Private online gallery", "Layflat signature album (30 pages)", "Pre-wedding planning call"],
          timeline: "3 – 4 weeks", addons: ["Second photographer", "Pre-wedding session", "Drone coverage", "Same-day slideshow"], featured: true },
        { tier: "Luxury", name: "Luxury Heirloom", price: 1450000, coverage: "14 hours + rehearsal coverage", photos: 900,
          deliverables: ["Two-photographer team", "Highlight film edit (3 – 5 min)", "Premium heirloom album (50 pages)", "Parent albums × 2", "Bespoke wooden presentation box", "Priority 2-week delivery"],
          timeline: "2 – 3 weeks", addons: ["Full cinematic film", "Pre-wedding editorial session", "Destination travel"] },
      ],
    },
    {
      id: "prewedding",
      name: "Pre-Wedding Photography",
      slug: "pre-wedding-photography",
      short: "Editorial engagement sessions, in studio or on location.",
      intro: "A considered session before the day itself — an opportunity to become comfortable in front of the camera, to test the light, and to create imagery you will genuinely want to print.",
      img: 30822485, alt: "Couple embracing in soft sunlight during a romantic engagement photo session",
      duration: "2 – 4 hours",
      deliverables: ["Private online gallery", "High-resolution image set", "Location styling guide", "Two outfit changes supported"],
      timeline: "Full gallery in 10 – 14 days",
      packages: [
        { tier: "Essential", name: "Essential Session", price: 120000, coverage: "1 location · 2 hours", photos: 60,
          deliverables: ["Private online gallery", "High-res JPEG set", "Web-optimised set"], timeline: "10 days",
          addons: ["Extra location", "Hair & makeup direction"] },
        { tier: "Signature", name: "Signature Editorial", price: 220000, coverage: "2 locations · 4 hours", photos: 140,
          deliverables: ["Private online gallery", "High-res JPEG set", "Concept & moodboard planning", "Framed fine-art print (A3)"], timeline: "12 days",
          addons: ["Studio hire", "Styling team", "Cinematic save-the-date clip"], featured: true },
        { tier: "Luxury", name: "Luxury Destination", price: 480000, coverage: "Full day · up to 3 locations", photos: 300,
          deliverables: ["Full-day creative direction", "Styling & wardrobe consultation", "Private online gallery", "Fine-art album (24 pages)", "2 framed A2 prints"], timeline: "14 days",
          addons: ["Drone coverage", "Accommodation & travel", "Videography"] },
      ],
    },
    {
      id: "portrait",
      name: "Portrait Photography",
      slug: "portrait-photography",
      short: "Studio and natural-light portraiture for individuals and families.",
      intro: "Portraiture is a conversation before it is a photograph. Sessions are unhurried, guided and shaped around who you actually are — executive headshots, maternity, personal branding and family sittings.",
      img: 37233404, alt: "Stylish woman in black outfit photographed in studio with dramatic lighting",
      duration: "1 – 2 hours",
      deliverables: ["Private online gallery", "Retouched high-res images", "Print release", "Studio or location option"],
      timeline: "Gallery in 7 – 10 days",
      packages: [
        { tier: "Essential", name: "Essential Sitting", price: 65000, coverage: "45 minutes · studio", photos: 15,
          deliverables: ["Online gallery", "5 fully retouched images", "1 look / outfit"], timeline: "7 days",
          addons: ["Additional retouched images", "Extra outfit"] },
        { tier: "Signature", name: "Signature Portrait", price: 145000, coverage: "90 minutes · studio or location", photos: 40,
          deliverables: ["Online gallery", "12 fully retouched images", "2 looks", "A3 fine-art print"], timeline: "10 days",
          addons: ["Hair & makeup artist", "Extra location", "Family add-on"], featured: true },
        { tier: "Luxury", name: "Luxury Portrait Experience", price: 320000, coverage: "3 hours · multi-location", photos: 90,
          deliverables: ["Pre-session moodboard & direction", "Hair, makeup & styling team", "Online gallery", "30 retouched images", "Framed A2 wall portrait", "Fine-art folio box"], timeline: "12 days",
          addons: ["Home portrait session", "Boudoir add-on", "Pet inclusion"] },
      ],
    },
    {
      id: "event",
      name: "Birthday & Event Photography",
      slug: "birthday-and-event-photography",
      short: "Birthdays, galas, anniversaries, cultural and corporate occasions.",
      intro: "From intimate milestone birthdays to large-format galas, coverage is planned around your run-of-show so nothing important is missed and nobody feels followed.",
      img: 16999913, alt: "Teenage girl in tiara celebrating her birthday with elegance at a reception",
      duration: "3 – 8 hours",
      deliverables: ["Private online gallery", "High-res image set", "Same-week delivery option", "Guest access link"],
      timeline: "5 – 10 days",
      packages: [
        { tier: "Essential", name: "Essential Coverage", price: 95000, coverage: "3 hours", photos: 120,
          deliverables: ["One photographer", "Online gallery", "High-res JPEG set"], timeline: "7 days",
          addons: ["Extra hour", "Instant print station"] },
        { tier: "Signature", name: "Signature Occasion", price: 185000, coverage: "5 hours", photos: 300,
          deliverables: ["One photographer + assistant", "Online gallery", "High-res JPEG set", "Highlight reel for social", "Guest gallery link"], timeline: "7 days",
          addons: ["Photo booth", "Second photographer", "Same-day edit"], featured: true },
        { tier: "Luxury", name: "Luxury Celebration", price: 395000, coverage: "8 hours", photos: 600,
          deliverables: ["Two-photographer team", "Online gallery + guest link", "High-res JPEG set", "Cinematic highlight film", "Bespoke guestbook album"], timeline: "10 days",
          addons: ["Live slideshow", "Roving video team", "Red-carpet setup"] },
      ],
    },
    {
      id: "fashion",
      name: "Fashion & Editorial Photography",
      slug: "fashion-and-editorial-photography",
      short: "Lookbooks, campaigns and magazine editorial work.",
      intro: "Concept development, casting support, styling coordination and lighting design for designers, stylists and publications that need imagery with a point of view.",
      img: 10670833, alt: "Fashion model in a black blazer posed against dramatic studio lighting",
      duration: "Half or full day",
      deliverables: ["Curated image set", "Campaign-ready exports", "Usage licence agreed in writing", "Retouching included"],
      timeline: "7 – 14 days",
      packages: [
        { tier: "Essential", name: "Essential Lookbook", price: 180000, coverage: "4 hours · studio", photos: 25,
          deliverables: ["Up to 4 looks", "Colour-graded exports", "Web + print sizes"], timeline: "7 days",
          addons: ["Additional look", "Model direction"] },
        { tier: "Signature", name: "Signature Campaign", price: 380000, coverage: "Full day · studio or location", photos: 60,
          deliverables: ["Up to 10 looks", "Concept development & moodboard", "Advanced retouching", "Full usage licence (12 months)"], timeline: "10 days",
          addons: ["Studio hire", "Lighting rental", "Styling team"], featured: true },
        { tier: "Luxury", name: "Luxury Editorial Production", price: 850000, coverage: "Multi-day production", photos: 150,
          deliverables: ["End-to-end creative direction", "Casting & location scouting", "Full crew coordination", "Campaign + editorial deliverables", "Unlimited usage licence"], timeline: "14 days",
          addons: ["Motion content", "Set design", "Post-production house"] },
      ],
    },
    {
      id: "corporate",
      name: "Corporate & Commercial Photography",
      slug: "corporate-and-commercial-photography",
      short: "Headshots, brand libraries, conferences and internal communications.",
      intro: "Consistent, professional imagery that scales across a whole organisation — from individual executive portraits to multi-day conference archives delivered on brand and on time.",
      img: 33539340, alt: "Confident professional woman in a black suit photographed against a clean backdrop",
      duration: "Per half or full day",
      deliverables: ["On-brand image library", "Web + print exports", "Usage licence", "Optional on-site station"],
      timeline: "3 – 7 days",
      packages: [
        { tier: "Essential", name: "Essential Headshots", price: 85000, coverage: "2 hours · up to 8 people", photos: 16,
          deliverables: ["Retouched headshots", "Consistent brand crop set"], timeline: "5 days",
          addons: ["Additional person", "On-location fee"] },
        { tier: "Signature", name: "Signature Brand Day", price: 260000, coverage: "Full day · team + environment", photos: 120,
          deliverables: ["Headshots + candid culture set", "Brand style guide for imagery", "Retouched selects", "Usage licence"], timeline: "7 days",
          addons: ["Video testimonials", "Extra shoot day", "Retainer"], featured: true },
        { tier: "Luxury", name: "Luxury Annual Retainer", price: 1250000, coverage: "6 shoot days across 12 months", photos: 600,
          deliverables: ["Priority scheduling", "Dedicated brand imagery library", "Monthly content shoot", "Full commercial licence", "Named account contact"], timeline: "48-hour turnaround",
          addons: ["Video retainer", "Multi-city coverage"] },
      ],
    },
    {
      id: "product",
      name: "Product Photography",
      slug: "product-photography",
      short: "E-commerce, catalogue, packaging and advertising product imagery.",
      intro: "Precision product work on white, lifestyle sets or bespoke builds — colour-accurate, retouch-clean and ready for your storefront and advertising channels.",
      img: 7075055, alt: "Luxury perfume bottle photographed against an ornate backdrop on a reflective surface",
      duration: "Per product or per day",
      deliverables: ["Web-optimised exports", "Marketplace-compliant files", "Colour-accurate retouching", "Optional 360° spin set"],
      timeline: "3 – 7 days",
      packages: [
        { tier: "Essential", name: "Essential Catalogue", price: 45000, coverage: "Up to 5 products", photos: 15,
          deliverables: ["Clean white-background set", "Colour-corrected exports"], timeline: "4 days",
          addons: ["Additional product", "Infographic overlay"] },
        { tier: "Signature", name: "Signature Product Set", price: 135000, coverage: "Up to 15 products", photos: 45,
          deliverables: ["White + lifestyle sets", "Advanced retouching", "Zoom-ready hi-res files", "Marketplace sizing pack"], timeline: "6 days",
          addons: ["Model-in-frame shots", "Bespoke set build"], featured: true },
        { tier: "Luxury", name: "Luxury Campaign Studio", price: 395000, coverage: "Full studio day · unlimited SKUs", photos: 120,
          deliverables: ["Art-directed campaign imagery", "Full retouching studio pass", "360° spin sets", "Ad-channel export bundles", "Usage licence"], timeline: "10 days",
          addons: ["Motion product film", "Props & set design", "Amazon A+ content"] },
      ],
    },
  ],

  /* 07. ADD-ONS ---------------------------------------------------------- */
  addons: [
    { name: "Second photographer", price: 90000, note: "Recommended for weddings above 150 guests" },
    { name: "Additional hour of coverage", price: 25000, note: "Billed per hour beyond package coverage" },
    { name: "Drone / aerial coverage", price: 120000, note: "Subject to local aviation permissions" },
    { name: "Same-day highlight edit", price: 85000, note: "Slideshow ready for your reception" },
    { name: "Hair & makeup artistry", price: 65000, note: "Per sitting, via partner artists" },
    { name: "Studio hire (half day)", price: 70000, note: "Depends on studio availability" },
    { name: "Extra retouched images", price: 6000, note: "Per image, on selected frames" },
    { name: "Rush delivery (50% faster)", price: 75000, note: "Subject to studio schedule" },
    { name: "Travel outside included radius", price: 35000, note: "Per 100km beyond " + 50 + "km, plus accommodation" },
    { name: "Fine-art album (30 pages)", price: 155000, note: "Layflat, linen-bound, archival paper" },
    { name: "Cinematic highlight film", price: 260000, note: "3 – 5 minute edit with licensed score" },
    { name: "Photo booth / instant print station", price: 140000, note: "Includes attendant and unlimited prints" },
  ],

  /* 08. PORTFOLIO IMAGES ------------------------------------------------- */
  // `alt` doubles as the descriptive caption; `f` is a friendly descriptive filename hint.
  portfolio: [
    { id: 4138802,  c: "weddings",    a: "Bride and groom embracing at golden hour during an outdoor ceremony" },
    { id: 13305426, c: "weddings",    a: "Bride holding her groom close during a warm sunset portrait" },
    { id: 27499475, c: "weddings",    a: "Newlyweds embracing in a sunlit meadow surrounded by glowing trees" },
    { id: 40130306, c: "weddings",    a: "Quiet sunset wedding portrait framed by open sky" },
    { id: 34294438, c: "weddings",    a: "Bride and groom sharing a tender moment on a serene beach at dusk" },
    { id: 38270639, c: "lifestyle",   a: "Couple walking hand in hand through warm evening light" },
    { id: 31100310, c: "weddings",    a: "Elegant outdoor wedding couple portrait at sunset" },
    { id: 32310177, c: "weddings",    a: "Couple in traditional attire at a vibrant wedding celebration" },
    { id: 36725414, c: "weddings",    a: "Bride and groom posing in a garden during golden hour" },
    { id: 30822485, c: "lifestyle",   a: "Engagement session captured in soft directional sunlight" },
    { id: 28863302, c: "portraits",   a: "Elegant woman photographed with dramatic shadow play" },
    { id: 28751624, c: "portraits",   a: "Glamorous woman under a spotlight in a monochrome portrait" },
    { id: 37233404, c: "portraits",   a: "Stylish woman in black photographed in a studio portrait session" },
    { id: 17938033, c: "portraits",   a: "Striking low-light portrait of a man with silver hair" },
    { id: 32321512, c: "portraits",   a: "Moody side-profile portrait of a young man in a black hoodie" },
    { id: 23911182, c: "portraits",   a: "Woman illuminated by a single spotlight in a dark studio" },
    { id: 33714925, c: "fashion",     a: "Fashion model in a black dress in a red-lit studio setting" },
    { id: 10670833, c: "fashion",     a: "Model in a structured black blazer with dramatic red lighting" },
    { id: 36991336, c: "fashion",     a: "Editorial portrait with layered red and blue studio lighting" },
    { id: 26834972, c: "portraits",   a: "Corporate portrait of a man with his arms crossed" },
    { id: 33539340, c: "portraits",   a: "Professional woman in a black suit photographed for a brand profile" },
    { id: 30468665, c: "portraits",   a: "Confident business headshot against a neutral studio backdrop" },
    { id: 7845331,  c: "corporate",   a: "Senior executive photographed during a formal board meeting" },
    { id: 39023431, c: "events",      a: "Guest in a silver gown posing at a formal indoor gala" },
    { id: 19203827, c: "events",      a: "Champagne tower being poured at a wedding reception" },
    { id: 19154212, c: "events",      a: "Bassist performing energetically at a lively indoor party" },
    { id: 10218458, c: "events",      a: "Guests dancing and celebrating at an outdoor gathering" },
    { id: 16999913, c: "events",      a: "Birthday celebrant in a tiara at a lavish indoor reception" },
    { id: 32145882, c: "events",      a: "Guest in a white gown at a floral-decorated evening event" },
    { id: 40268513, c: "events",      a: "Guest in a red gown and tiara seated at a festive table" },
    { id: 33769352, c: "lifestyle",   a: "Father and daughters playing together on a sunlit lawn" },
    { id: 19510855, c: "lifestyle",   a: "Family enjoying an outdoor picnic at sunset" },
    { id: 33204397, c: "lifestyle",   a: "Parents with their baby in a warm sunlit field" },
    { id: 27176330, c: "lifestyle",   a: "Family of three bonding during an outdoor picnic" },
    { id: 37900999, c: "commercial",  a: "Wristwatch and perfume bottle styled on a leather surface" },
    { id: 7093175,  c: "commercial",  a: "Monochrome still life of a watch, bow tie and fragrance" },
    { id: 4769238,  c: "commercial",  a: "Flat lay of perfume bottles and a smartwatch on silk fabric" },
    { id: 26859235, c: "commercial",  a: "Perfume bottle styled with petals and sand for a product campaign" },
    { id: 7075055,  c: "commercial",  a: "Fragrance bottle on a reflective surface against an ornate backdrop" },
    { id: 7989967,  c: "commercial",  a: "Gold wristwatch beside a bottle of perfume, styled product shot" },
    { id: 7703038,  c: "commercial",  a: "Designer fragrance bottles arranged for a retail campaign" },
    { id: 18362428, c: "commercial",  a: "Watch and perfume bottle on a black background, advertising still life" },
    { id: 8995313,  c: "about",       a: "Photographer holding a professional camera lens in a studio" },
    { id: 8995315,  c: "about",       a: "Photographer holding a DSLR camera against a black studio backdrop" },
    { id: 8394305,  c: "about",       a: "Photographer working with a DSLR camera and flash indoors" },
  ],
  categories: [
    { id: "all",        label: "All Work" },
    { id: "weddings",   label: "Wedding" },
    { id: "portraits",  label: "Portrait" },
    { id: "fashion",    label: "Fashion" },
    { id: "events",     label: "Event" },
    { id: "lifestyle",  label: "Lifestyle" },
    { id: "commercial", label: "Commercial" },
  ],

  /* 09. PROJECT CASE STUDIES --------------------------------------------- */
  projects: [
    {
      id: "amara-and-tunde",
      title: "Amara & Tunde",
      subtitle: "A two-day traditional and white wedding celebration",
      category: "Wedding Photography", collection: "weddings",
      location: "[City, Nigeria — PLACEHOLDER]", date: "November 2025",
      services: ["Wedding Photography — Luxury Heirloom", "Second photographer", "Cinematic highlight film"],
      cover: 36725414,
      intro: "Two days, two ceremonies, one continuous story. We began with the traditional rites in warm afternoon light and closed the white wedding under a canopy of festoon lighting.",
      body: [
        "The brief was simple and difficult in equal measure: photograph a large, joyful, fast-moving celebration without ever making the family feel observed. We worked as a two-photographer team, one anchored to the couple and one moving constantly through the room.",
        "We planned the light before the day. A walkthrough at the venue in the same month, at the same hour, meant we knew exactly where the sun would fall during the ring exchange — and where to be standing when it did.",
        "The final edit was delivered as a 900-image heirloom gallery with a hand-bound 50-page album and two parent albums, alongside a four-minute film cut to licensed score.",
      ],
      stats: [{ k: "Images delivered", v: "900+" }, { k: "Coverage", v: "14 hours" }, { k: "Delivery", v: "3 weeks" }],
      gallery: [36725414, 13305426, 27499475, 32310177, 40130306, 34294438],
    },
    {
      id: "monochrome-study",
      title: "Monochrome Study",
      subtitle: "A studio portrait series on single-source light",
      category: "Portrait Photography", collection: "portraits",
      location: "[Studio — PLACEHOLDER]", date: "September 2025",
      services: ["Portrait Photography — Signature Portrait", "Studio hire", "Hair & makeup artistry"],
      cover: 28751624,
      intro: "A deliberate exercise in restraint: one light, one modifier, one subject, and a long lens. Everything unnecessary removed.",
      body: [
        "The series began as a technical exercise and became a study in patience. Each frame was lit with a single source through a large scrim, metered and re-metered until the falloff landed exactly where we wanted it.",
        "We shot in monochrome preview on the back of the camera, which changes how a sitter responds. Without colour to lean on, expression and structure have to carry the whole frame.",
        "Delivered as a curated set of twelve fully retouched images and a single A2 fine-art print, framed in walnut.",
      ],
      stats: [{ k: "Images delivered", v: "40" }, { k: "Session length", v: "90 minutes" }, { k: "Delivery", v: "10 days" }],
      gallery: [28751624, 28863302, 32321512, 23911182, 17938033, 37233404],
    },
    {
      id: "ember-editorial",
      title: "Ember",
      subtitle: "An autumn fashion editorial for an independent label",
      category: "Fashion Photography", collection: "fashion",
      location: "[City — PLACEHOLDER]", date: "October 2025",
      services: ["Fashion & Editorial Photography — Signature Campaign", "Styling team", "Lighting rental"],
      cover: 33714925,
      intro: "A ten-look editorial built around saturated gels, hard shadow and structured tailoring — shot for an independent label's autumn drop.",
      body: [
        "We began with a moodboard three weeks out. Colour direction, silhouette references and a lighting plan were agreed with the designer before a single look was pulled.",
        "The studio was rigged with two hard sources through coloured gels, plus a bare reflector for fill. Ten looks were photographed across a single day with a five-person crew.",
        "Deliverables included sixty colour-graded images across web, print and paid-social crops, plus a twelve-month usage licence.",
      ],
      stats: [{ k: "Looks photographed", v: "10" }, { k: "Crew", v: "5 people" }, { k: "Delivery", v: "10 days" }],
      gallery: [33714925, 10670833, 36991336, 28863302, 23911182, 37233404],
    },
    {
      id: "maison-noir",
      title: "Maison Noir",
      subtitle: "Fragrance campaign stills for a boutique perfume house",
      category: "Commercial Photography", collection: "commercial",
      location: "[Studio — PLACEHOLDER]", date: "August 2025",
      services: ["Product Photography — Luxury Campaign Studio", "Set design", "360° spin set"],
      cover: 7075055,
      intro: "A full studio day building reflected surfaces, controlled highlights and ornate backdrops for a boutique fragrance launch.",
      body: [
        "Glass is the hardest subject in still life. Every surface reflects the studio, so every surface has to be managed. We built flags and cards around each set to place the highlights exactly on the bottle's shoulder.",
        "Beyond the hero stills we produced a set of 360° spins for the client's product pages and a bundle of exports pre-cropped for marketplace and paid social.",
        "Delivered as 120 colour-accurate retouched files with an unlimited usage licence.",
      ],
      stats: [{ k: "Images delivered", v: "120" }, { k: "Sets built", v: "6" }, { k: "Delivery", v: "10 days" }],
      gallery: [7075055, 37900999, 26859235, 7989967, 18362428, 7703038],
    },
    {
      id: "the-long-table",
      title: "The Long Table",
      subtitle: "A sixtieth birthday celebration in a private garden",
      category: "Event Photography", collection: "events",
      location: "[City — PLACEHOLDER]", date: "December 2025",
      services: ["Birthday & Event Photography — Signature Occasion", "Same-day highlight edit"],
      cover: 19203827,
      intro: "A sixtieth birthday told through the small moments between the speeches — glasses, hands, laughter at the far end of the table.",
      body: [
        "We agreed a light-touch coverage plan with the family: nothing staged, nothing interrupted, everything from the edges of the room.",
        "A same-day highlight edit of thirty images was ready before dessert, projected onto the garden wall.",
        "The full gallery of 300 images was delivered within the week alongside a guest access link.",
      ],
      stats: [{ k: "Images delivered", v: "300" }, { k: "Coverage", v: "5 hours" }, { k: "Delivery", v: "7 days" }],
      gallery: [19203827, 39023431, 16999913, 32145882, 40268513, 10218458],
    },
    {
      id: "ordinary-days",
      title: "Ordinary Days",
      subtitle: "A lifestyle family series on unposed connection",
      category: "Lifestyle Photography", collection: "lifestyle",
      location: "[City — PLACEHOLDER]", date: "July 2025",
      services: ["Lifestyle session — bespoke quote"],
      cover: 33769352,
      intro: "No matching outfits, no forced smiles. An afternoon documented exactly as it happened, in a field, with a picnic blanket and three children who did not care about the camera.",
      body: [
        "The session ran for two hours with no shot list. We walked, we waited, and we let the children set the pace.",
        "The strongest frames came in the last fifteen minutes, once everyone had forgotten we were there.",
        "Delivered as a gallery of 120 images with a framed A2 print for the family home.",
      ],
      stats: [{ k: "Images delivered", v: "120" }, { k: "Session length", v: "2 hours" }, { k: "Delivery", v: "10 days" }],
      gallery: [33769352, 19510855, 33204397, 27176330, 30822485, 38270639],
    },
  ],

  /* 10. TESTIMONIALS — DEMONSTRATION CONTENT ----------------------------- */
  // ⚠️ These are DEMONSTRATION quotes written for this prototype.
  // They are NOT real client testimonials and must be replaced before launch.
  testimonials: [
    { quote: "DEMONSTRATION QUOTE — The photographs feel like the day actually felt. Nothing was staged and nothing was missed.", name: "Client Name", role: "Wedding, [City — PLACEHOLDER]", initials: "CN" },
    { quote: "DEMONSTRATION QUOTE — Calm, prepared and completely professional from the first planning call to final delivery.", name: "Client Name", role: "Corporate Brand Day, [Company — PLACEHOLDER]", initials: "CN" },
    { quote: "DEMONSTRATION QUOTE — I have never felt comfortable in front of a camera. Something changed in that studio.", name: "Client Name", role: "Portrait Session, [City — PLACEHOLDER]", initials: "CN" },
    { quote: "DEMONSTRATION QUOTE — Our campaign imagery outperformed every previous launch. The craft shows in the numbers.", name: "Client Name", role: "Fashion Campaign, [Brand — PLACEHOLDER]", initials: "CN" },
  ],

  /* 11. FAQ -------------------------------------------------------------- */
  faqs: [
    { q: "How do I book a photography session?",
      a: "Complete the booking form on the Bookings page. You will select your service, package, preferred date and time, and provide your event details. Submitting the form sends an enquiry — it does not confirm availability. The studio responds to confirm, discuss requirements and issue a formal quotation." },
    { q: "Does submitting the booking form reserve my date?",
      a: "No. Submitting the form creates an enquiry only. Your date is reserved once the studio confirms availability in writing and the booking deposit is received. Until then the date may be booked by another client." },
    { q: "How much is the booking deposit?",
      a: "The demonstration configuration in this build uses a 40% deposit, with the balance due 7 days before the event. Both values are editable in the commercial configuration and should be set to your real policy." },
    { q: "What are your delivery timelines?",
      a: "Preview highlight sets are typically delivered within 48 hours of a wedding. Full galleries range from 3 days for small product sets to 4 weeks for large multi-day weddings. Each package lists its own timeline." },
    { q: "Do you travel for shoots?",
      a: "Yes. Travel within a 50km radius is included in the demonstration configuration. Beyond that, travel is billed per 100km plus accommodation where an overnight stay is required. Destination and international work is quoted individually." },
    { q: "How many photographs will I receive?",
      a: "Every package states the approximate number of edited images. We do not deliver unedited files. Additional retouched images beyond your package allowance can be added per image." },
    { q: "Do I own the copyright to my images?",
      a: "The photographer retains copyright as author of the work. Clients receive a licence to print and share for personal use, and commercial usage is defined in writing per project. Full buyouts are available on request." },
    { q: "Can I reschedule or cancel?",
      a: "Rescheduling is supported where the studio calendar allows and reasonable notice is given. Deposits are generally non-refundable because the date was held exclusively for you. Read the cancellation and rescheduling policy for the full detail." },
    { q: "What happens if it rains on my outdoor shoot?",
      a: "Weather plans are discussed before every outdoor session. We scout covered alternatives, adjust timings toward the best light, or reschedule at no additional fee where the session has not yet begun." },
    { q: "Do you shoot video as well as stills?",
      a: "Cinematic highlight films are available as an add-on or within the Luxury tiers for weddings and events. Full-day videography is delivered with a partner filmmaker and quoted separately." },
    { q: "How will I receive my photographs?",
      a: "Through a private online gallery with individual download links, print ordering and optional password-protected sharing. Large wedding sets are delivered as organised folders with both high-resolution and web-optimised versions." },
    { q: "What is a private client gallery and how do I access it?",
      a: "Delivered collections live in a private area of the website that requires secure authentication. That area is a concept in this build — it cannot function until a backend with real user accounts is connected." },
  ],

  /* 12. POLICIES & PROCESS ---------------------------------------------- */
  process: [
    { step: "Enquiry & consultation", detail: "You submit an enquiry and we speak — by call, WhatsApp or in person — about what you actually need. No obligation." },
    { step: "Proposal & quotation", detail: "A written quotation with scope, deliverables, timeline and total. Illustrative prices on this site are replaced by your confirmed figures." },
    { step: "Deposit & date reservation", detail: "A booking deposit reserves your date exclusively. This is where a live payment gateway would confirm the transaction." },
    { step: "Planning & creative direction", detail: "Moodboards, run-of-show, location walkthroughs and styling notes so nothing is improvised on the day." },
    { step: "The shoot", detail: "Coverage as planned, with quiet direction where it helps and none where it does not." },
    { step: "Selection & edit", detail: "Culling, colour grading and retouching to a consistent house look." },
    { step: "Delivery", detail: "Private online gallery, downloads, print fulfilment and optional albums." },
  ],
  prepGuide: [
    { title: "Rest well, arrive unhurried", body: "The single biggest influence on portrait photography is how rested and relaxed the subject is. Build buffer into your morning." },
    { title: "Keep wardrobe simple and textural", body: "Solid tones and natural fabrics photograph better than logos and fine patterns. Bring one layer option for variety." },
    { title: "Decide who matters most", body: "For events, tell us the handful of people who must appear. We build a quiet mental shot list around them." },
    { title: "Trust the light plan", body: "If we have recommended a time of day, that recommendation is about light, not convenience. Golden hour is short." },
    { title: "Avoid new haircuts and facials", body: "Give any significant change at least a week to settle before a portrait or wedding shoot." },
    { title: "Share your run-of-show", body: "A simple timetable of speeches, entrances and key moments lets us be in position instead of reacting." },
  ],
  policies: [
    { title: "Cancellation by the client",
      body: "PLACEHOLDER POLICY — Replace with your confirmed terms. A common structure: written notice more than 60 days before the date retains a credit toward a future booking; 30 – 60 days forfeits 50% of the total; under 30 days the full fee is payable." },
    { title: "Rescheduling",
      body: "PLACEHOLDER POLICY — Rescheduling is permitted once at no additional fee where the studio has availability and at least 14 days' notice is given. A second reschedule is treated as a new booking at current rates." },
    { title: "Deposit & payment schedule",
      body: "PLACEHOLDER POLICY — In this build, 40% deposit on confirmation and the balance 7 days before the event. Both figures are configurable. Bank transfer and online payment are supported once the gateway is live." },
    { title: "Force majeure",
      body: "PLACEHOLDER POLICY — Where a date cannot proceed for reasons outside either party's control, the studio will transfer the booking to a mutually agreed alternative date at no additional cost." },
    { title: "Image retention & archiving",
      body: "PLACEHOLDER POLICY — Delivered galleries are typically retained online for 12 months. Extended archiving is available on request and may carry a fee." },
    { title: "Usage & licensing",
      body: "PLACEHOLDER POLICY — Clients receive a personal-use licence covering print and social sharing. Commercial, advertising and exclusive usage must be licensed in writing." },
  ],

  /* 13. ADMIN DEMO DATASET ------------------------------------------------ */
  // ⚠️ Entirely fictional demonstration data used to render the dashboard UI.
  // Nothing here is persisted or stored. Replace with a real database + API.
  admin: {
    // Frontend-only gate for the demonstration. NOT security.
    demoPasscode: "davideze-demo",
    bookings: [
      { ref: "TDE-2481", client: "Client Name A", email: "client.a@example.com", phone: "+234 000 000 0001", service: "Wedding Photography", pkg: "Luxury Heirloom", date: "2026-02-14", time: "09:00", location: "[City — PLACEHOLDER]", total: 1450000, deposit: 580000, status: "confirmed", guests: 320 },
      { ref: "TDE-2482", client: "Client Name B", email: "client.b@example.com", phone: "+234 000 000 0002", service: "Portrait Photography", pkg: "Signature Portrait", date: "2026-02-08", time: "11:30", location: "[Studio — PLACEHOLDER]", total: 145000, deposit: 58000, status: "pending", guests: 1 },
      { ref: "TDE-2483", client: "Client Name C", email: "client.c@example.com", phone: "+234 000 000 0003", service: "Product Photography", pkg: "Luxury Campaign Studio", date: "2026-01-29", time: "10:00", location: "[Studio — PLACEHOLDER]", total: 395000, deposit: 158000, status: "completed", guests: 0 },
      { ref: "TDE-2484", client: "Client Name D", email: "client.d@example.com", phone: "+234 000 000 0004", service: "Fashion & Editorial Photography", pkg: "Signature Campaign", date: "2026-03-03", time: "08:00", location: "[City — PLACEHOLDER]", total: 380000, deposit: 152000, status: "confirmed", guests: 12 },
      { ref: "TDE-2485", client: "Client Name E", email: "client.e@example.com", phone: "+234 000 000 0005", service: "Birthday & Event Photography", pkg: "Signature Occasion", date: "2026-01-18", time: "15:00", location: "[City — PLACEHOLDER]", total: 185000, deposit: 74000, status: "cancelled", guests: 90 },
      { ref: "TDE-2486", client: "Client Name F", email: "client.f@example.com", phone: "+234 000 000 0006", service: "Corporate & Commercial Photography", pkg: "Luxury Annual Retainer", date: "2026-02-21", time: "09:00", location: "[City — PLACEHOLDER]", total: 1250000, deposit: 500000, status: "confirmed", guests: 45 },
      { ref: "TDE-2487", client: "Client Name G", email: "client.g@example.com", phone: "+234 000 000 0007", service: "Pre-Wedding Photography", pkg: "Signature Editorial", date: "2026-03-14", time: "16:00", location: "[City — PLACEHOLDER]", total: 220000, deposit: 88000, status: "pending", guests: 2 },
      { ref: "TDE-2488", client: "Client Name H", email: "client.h@example.com", phone: "+234 000 000 0008", service: "Wedding Photography", pkg: "Signature Celebration", date: "2026-01-31", time: "10:00", location: "[City — PLACEHOLDER]", total: 750000, deposit: 300000, status: "completed", guests: 210 },
    ],
    enquiries: [
      { id: "ENQ-1042", name: "Enquirer Name A", email: "enquirer.a@example.com", subject: "Wedding coverage — April 2026", date: "2026-01-12", status: "new", channel: "Website form" },
      { id: "ENQ-1043", name: "Enquirer Name B", email: "enquirer.b@example.com", subject: "E-commerce product set — 40 SKUs", date: "2026-01-11", status: "replied", channel: "Website form" },
      { id: "ENQ-1044", name: "Enquirer Name C", email: "enquirer.c@example.com", subject: "Family portrait session", date: "2026-01-10", status: "new", channel: "WhatsApp" },
      { id: "ENQ-1045", name: "Enquirer Name D", email: "enquirer.d@example.com", subject: "Corporate headshots — 24 staff", date: "2026-01-09", status: "quoted", channel: "Website form" },
      { id: "ENQ-1046", name: "Enquirer Name E", email: "enquirer.e@example.com", subject: "Editorial collaboration enquiry", date: "2026-01-08", status: "closed", channel: "Instagram" },
    ],
    revenue: [
      { m: "Feb", v: 2450000 }, { m: "Mar", v: 3120000 }, { m: "Apr", v: 2870000 },
      { m: "May", v: 4010000 }, { m: "Jun", v: 3640000 }, { m: "Jul", v: 4390000 },
      { m: "Aug", v: 3210000 }, { m: "Sep", v: 4760000 }, { m: "Oct", v: 5240000 },
      { m: "Nov", v: 4870000 }, { m: "Dec", v: 6120000 }, { m: "Jan", v: 3890000 },
    ],
    serviceMix: [
      { label: "Weddings", v: 42 }, { label: "Portraits", v: 18 }, { label: "Events", v: 14 },
      { label: "Commercial", v: 12 }, { label: "Fashion", v: 9 }, { label: "Product", v: 5 },
    ],
  },

};

/* ==========================================================================
   SHARED HELPERS
   ========================================================================== */
const UTIL = {
  /** Format a Naira amount, e.g. 450000 → "₦450,000" */
  naira(n) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    return "₦" + Number(n).toLocaleString("en-NG");
  },
  /** Pretty date, e.g. 2026-02-14 → "14 February 2026" */
  prettyDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  },
  /** Get a service object by id */
  service(id) { return CONFIG.services.find(s => s.id === id) || null; },
  /** Get a package within a service by tier name */
  pkg(serviceId, tier) {
    const s = UTIL.service(serviceId);
    return s ? s.packages.find(p => p.tier === tier) || null : null;
  },
  /** Deposit calculation honouring the configurable percentage */
  deposit(total) { return Math.round(total * (CONFIG.commercial.depositPercent / 100)); },
  balance(total) { return total - UTIL.deposit(total); },
  /** Query param reader */
  param(name) { return new URLSearchParams(location.search).get(name); },
  /** Escape user-provided strings before injecting into the DOM */
  esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, m =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  },
  /** Booking reference generator (demonstration only) */
  makeRef() {
    const rnd = Math.floor(1000 + Math.random() * 8999);
    return "TDE-" + rnd;
  },
};
