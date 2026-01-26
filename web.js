document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js loaded");

  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

  // ===== Mobile Nav (CSS expects body.nav-open) =====
  const navToggle = $(".nav-toggle");
  const navLinks = $$(".nav__link");

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
      const expanded = document.body.classList.contains("nav-open");
      navToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  } else {
    console.warn("nav-toggle not found. Check class='nav-toggle' in HTML.");
  }

  navLinks.forEach((a) => a.addEventListener("click", closeNav));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // ===== Scroll Reveal (SAFE: never leave content hidden) =====
  const revealEls = $$(".reveal");

  // Always show everything after 800ms no matter what (prevents blank page)
  const safetyTimer = setTimeout(() => {
    revealEls.forEach((el) => el.classList.add("in"));
  }, 800);

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
    // keep safetyTimer as backup
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
    clearTimeout(safetyTimer);
  }

  // ===== Visit Counter (localStorage) =====
  const visitEl = $("#visit-count");
  if (visitEl) {
    const key = "sohel_portfolio_visits";
    const next = Number(localStorage.getItem(key) || "0") + 1;
    localStorage.setItem(key, String(next));
    visitEl.textContent = String(next);
  }

  // ===== Theme Toggle =====
  const themeBtn = $("[data-theme-toggle]");
  const root = document.documentElement;

  if (!themeBtn) {
    console.warn("Theme button not found. Add: <button data-theme-toggle class='theme-btn'>🌙</button>");
  } else {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") root.dataset.theme = savedTheme;
    if (!root.dataset.theme) root.dataset.theme = "dark";

    const syncThemeIcon = () => {
      themeBtn.textContent = root.dataset.theme === "light" ? "🌞" : "🌙";
    };
    syncThemeIcon();

    themeBtn.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
      syncThemeIcon();
    });
  }

  // ===== Lightbox =====
  const galleryItems = $$(".portfolio--files");
  if (galleryItems.length) {
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
        if (e.ctrlKey || e.metaKey) return; // allow opening Instagram link
        e.preventDefault();

        const img = $("img", a);
        const src = a.getAttribute("data-full") || img?.getAttribute("src");
        if (!src) return;

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
});
