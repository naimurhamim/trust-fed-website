// ============================================================
// TrustFed-SDN — site behaviour
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- theme toggle (dark / light) ---------- */
  const html = document.documentElement;
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const heroLogo = document.querySelector(".hero-main-logo");
  const footerLogo = document.querySelector(".footer-logo");

  const updateLogos = (theme) => {
    const isLight = theme === "light";
    // Light theme: switch to gradient logo with dark/black border
    // Dark theme: crisp white logo
    const logoSrc = isLight ? "images/logo-gradient.png" : "images/logo.png";
    if (heroLogo) heroLogo.src = logoSrc;
    if (footerLogo) footerLogo.src = logoSrc;
  };

  // Apply saved preference; default = dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  updateLogos(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateLogos(next);
    });
  }

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });

  /* ---------- scroll-spy active link ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll("[data-nav]");

  const setActive = (id) => {
    navItems.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
    });
  };

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((s) => spy.observe(s));

  /* ---------- scroll hide/show nav & scroll-to-top button ---------- */
  const nav = document.getElementById("nav");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const heroSection = document.getElementById("top");
  let lastScrollY = window.scrollY;
  let isTicking = false;

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    const heroHeight = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight) : 650;

    // If scrolled past the hero section: navbar NEVER appears (stays permanently hidden)
    if (currentScrollY >= heroHeight - 140) {
      nav.classList.add("nav-hidden");
    } else {
      // Inside hero section:
      if (currentScrollY <= 80) {
        // At the very top of hero: show navbar
        nav.classList.remove("nav-hidden");
      } else if (currentScrollY > lastScrollY && currentScrollY > 120) {
        // Scrolling down in hero: hide smoothly
        nav.classList.add("nav-hidden");
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up within hero: show
        nav.classList.remove("nav-hidden");
      }
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;

    // Scroll to Top button reveal from bottom
    if (scrollTopBtn) {
      if (currentScrollY > 300) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    }

    isTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (!isTicking) {
      window.requestAnimationFrame(onScroll);
      isTicking = true;
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* ---------- references see all / see less toggle ---------- */
  const refToggleBtn = document.getElementById("refToggleBtn");
  const refList = document.querySelector(".ref-list");

  if (refToggleBtn && refList) {
    refToggleBtn.addEventListener("click", () => {
      const isExpanded = refList.classList.toggle("expanded");
      refToggleBtn.classList.toggle("expanded", isExpanded);
      refToggleBtn.setAttribute("aria-expanded", isExpanded);

      const toggleText = refToggleBtn.querySelector(".ref-toggle-text");
      if (toggleText) {
        toggleText.textContent = isExpanded ? "See less" : "See all references (8)";
      }

      // If collapsing, smoothly scroll back to top of references section
      if (!isExpanded) {
        const refSection = document.getElementById("references");
        if (refSection) {
          const rect = refSection.getBoundingClientRect();
          if (rect.top < -100) {
            refSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    });
  }
});

