

(() => {
  // ---------- Helpers ----------
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

  // ---------- Mobile Nav (body.nav-open) ----------
  const navToggle = $(".nav-toggle");
  const navLinks = $$(".nav__link");

  const closeNav = () => document.body.classList.remove("nav-open");
  const toggleNav = () => document.body.classList.toggle("nav-open");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      toggleNav();
      const expanded = document.body.classList.contains("nav-open");
      navToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  // Close nav when clicking a link (mobile UX)
  navLinks.forEach((a) => a.addEventListener("click", closeNav));

  // Close nav on Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // ---------- Scroll Reveal (.reveal -> .in) ----------
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ---------- Visit Counter (localStorage, GitHub Pages friendly) ----------
  const visitEl = $("#visit-count");
  if (visitEl) {
    const key = "sohel_portfolio_visits";
    const current = Number(localStorage.getItem(key) || "0");
    const next = current + 1;
    localStorage.setItem(key, String(next));
    visitEl.textContent = String(next);
  }

  // ---------- Theme Toggle (optional) ----------
  // If you kept the updated HTML, it has [data-theme-toggle].
  const themeBtn = $("[data-theme-toggle]");
  const root = document.documentElement;

  // restore theme if saved
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  } else {
    // default stays whatever your HTML sets (e.g. data-theme="dark")
    if (!root.dataset.theme) root.dataset.theme = "dark";
  }

  const syncThemeIcon = () => {
    if (!themeBtn) return;
    const t = root.dataset.theme === "light" ? "light" : "dark";
    themeBtn.textContent = t === "light" ? "🌞" : "🌙";
  };

  syncThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.dataset.theme === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
      syncThemeIcon();
    });
  }

  // ---------- Lightbox for Gallery (optional but nice) ----------
  // Works with your gallery anchors: .portfolio--files containing img
  // Click opens lightbox unless Ctrl/Cmd is pressed (then it opens Instagram link).
  // Auto-injects lightbox HTML if missing.
  const galleryItems = $$(".portfolio--files");
  if (galleryItems.length) {
    // Inject lightbox if not present
    let lightbox = $("#lightbox");
    if (!lightbox) {
      const lb = document.createElement("div");
      lb.id = "lightbox";
      lb.className = "lightbox";
      lb.setAttribute("aria-hidden", "true");
      lb.innerHTML = `
        <button class="lightbox__close" aria-label="Close">✕</button>
        <img class="lightbox__img" alt="">
      `;
      document.body.appendChild(lb);
      lightbox = lb;
    }

    // Ensure CSS class names match the CSS provided
    lightbox.classList.add("lightbox");
    const lbImg = $(".lightbox__img", lightbox);
    const lbClose = $(".lightbox__close", lightbox);

    const openLightbox = (src, alt = "") => {
      if (!lbImg) return;
      lbImg.src = src;
      lbImg.alt = alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      if (lbImg) lbImg.src = "";
      document.body.style.overflow = "";
    };

    galleryItems.forEach((a) => {
      a.addEventListener("click", (e) => {
        // allow opening Instagram in new tab with ctrl/cmd click
        if (e.ctrlKey || e.metaKey) return;

        // If you added data-full attribute in HTML, use it; otherwise use the <img src="">
        const full = a.getAttribute("data-full");
        const img = $("img", a);
        const src = full || img?.getAttribute("src");

        if (!src) return;

        e.preventDefault();
        openLightbox(src, img?.alt || "Photo");
      });
    });

    lbClose?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }
})();
