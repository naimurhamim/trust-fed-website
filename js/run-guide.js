// TrustFed-SDN — Live Testbed Run Guide page controller
// Theme toggle (shared localStorage key), copy buttons, screenshot lightbox,
// reading progress bar, and active step highlight in the jump navigation.

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;

  /* Theme toggle (same "theme" key as the monograph) */
  const brandLogos = document.querySelectorAll("[data-brand-logo]");
  const applyLogos = (theme) => {
    const src = theme === "light" ? "images/logo-gradient.png" : "images/logo.png";
    brandLogos.forEach((img) => {
      img.src = src;
    });
  };
  applyLogos(html.getAttribute("data-theme") || "dark");

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      applyLogos(next);
    });
  }

  /* Copy-to-clipboard buttons */
  document.querySelectorAll(".copy-btn[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const codeEl = document.getElementById(btn.dataset.copyTarget);
      if (!codeEl) return;
      const orig = btn.textContent;
      try {
        await navigator.clipboard.writeText(codeEl.textContent.trim());
        btn.textContent = "Copied!";
      } catch {
        btn.textContent = "Copy manually";
      }
      setTimeout(() => {
        btn.textContent = orig;
      }, 1600);
    });
  });

  /* Screenshot lightbox */
  const lightbox = document.getElementById("lightboxModal");
  const lbImg = document.getElementById("lightboxImg");
  const lbTitle = document.getElementById("lightboxTitle");
  const lbClose = document.getElementById("lightboxCloseBtn");
  const closeLightbox = () => lightbox && lightbox.classList.remove("open");

  document.querySelectorAll(".shot-frame").forEach((frame) => {
    frame.addEventListener("click", () => {
      const img = frame.querySelector("img");
      if (!img || !lightbox) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbTitle.textContent = frame.dataset.title || img.alt || "Screenshot";
      lightbox.classList.add("open");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* Reading progress + active step highlight */
  const progressFill = document.getElementById("readProgressFill");
  const sections = Array.from(document.querySelectorAll(".guide-step[id]"));
  const jumpLinks = Array.from(document.querySelectorAll(".step-jump a"));
  let raf = null;

  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (progressFill) {
        const pct = maxScroll > 0 ? Math.min(100, (window.scrollY / maxScroll) * 100) : 100;
        progressFill.style.width = `${pct}%`;
      }
      const trigger = window.innerHeight * 0.3;
      let activeId = sections.length ? sections[0].id : "";
      sections.forEach((sec) => {
        if (sec.getBoundingClientRect().top <= trigger) activeId = sec.id;
      });
      if (window.scrollY >= maxScroll - 4 && sections.length) {
        activeId = sections[sections.length - 1].id;
      }
      jumpLinks.forEach((a) => {
        const on = a.getAttribute("href") === `#${activeId}`;
        a.classList.toggle("active", on);
        if (on) a.scrollIntoView({ block: "nearest", inline: "nearest" });
      });
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
});
