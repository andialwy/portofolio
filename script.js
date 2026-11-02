/* =========================================================
   Portofolio — interaksi halaman
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------
     1. Tahun otomatis di footer
     --------------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     2. Efek mengetik pada hero
        GANTI: daftar peran/keahlian di bawah ini
     --------------------------------------------------------- */
  const roles = [
    "Data Analyst",
    "ESG Specialist",
    "Business Administrator",
    "Telecommunication Engineer"
  ];

  const typedEl = $("#typed");

  if (typedEl) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = roles[roleIndex];
        typedEl.textContent = current.slice(0, charIndex);

        if (!deleting && charIndex < current.length) {
          charIndex++;
          setTimeout(tick, 65);
        } else if (!deleting && charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1700);
        } else if (deleting && charIndex > 0) {
          charIndex--;
          setTimeout(tick, 32);
        } else {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 380);
        }
      };

      tick();
    }
  }

  /* ---------------------------------------------------------
     3. Navbar: bayangan saat digulir + menu mobile
     --------------------------------------------------------- */
  const navbar = $("#navbar");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  const onScrollNav = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  const closeMenu = () => {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    });
  }

  // Tutup menu saat tautan diklik
  $$(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));

  // Tutup menu saat area luar diklik
  document.addEventListener("click", (e) => {
    if (!navLinks || !navLinks.classList.contains("open")) return;
    if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
    closeMenu();
  });

  /* ---------------------------------------------------------
     4. Sorot tautan navigasi sesuai posisi gulir
     --------------------------------------------------------- */
  const sections = $$("main section[id]");
  const navAnchors = $$(".nav-link[href^='#']");

  const setActiveLink = (id) => {
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  };

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------
     5. Animasi muncul saat digulir
     --------------------------------------------------------- */
  const revealEls = $$(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = Math.min(i % 6, 5) * 70 + "ms";
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------
     6. Bilangan statistik naik perlahan
     --------------------------------------------------------- */
  const counters = $$("[data-count]");

  const runCounter = (el) => {
    const target = Number(el.dataset.count) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }

  /* ---------------------------------------------------------
     7. Bar keahlian terisi saat terlihat
     --------------------------------------------------------- */
  const bars = $$(".bar i");

  const fillBar = (bar) => {
    const level = Math.max(0, Math.min(100, Number(bar.dataset.level) || 0));
    bar.style.width = level + "%";
  };

  if (bars.length && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          fillBar(entry.target);
          barObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    bars.forEach((bar) => barObserver.observe(bar));
  } else {
    bars.forEach(fillBar);
  }

  /* ---------------------------------------------------------
     8. Filter proyek
     --------------------------------------------------------- */
  const filters = $$(".filter");
  const cards = $$(".project-card");

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.filter;

      filters.forEach((b) => b.classList.toggle("active", b === btn));

      cards.forEach((card) => {
        const match = category === "all" || card.dataset.category === category;
        card.classList.toggle("hidden", !match);
        if (match) {
          card.classList.add("visible");
          card.style.transitionDelay = "0ms";
        }
      });
    });
  });

  /* ---------------------------------------------------------
     9. Form kontak: validasi sederhana
        Catatan: demo ini belum mengirim ke server.
        Ganti bagian "sukses" dengan fetch() ke API/Formspree/EmailJS.
     --------------------------------------------------------- */
  const form = $("#contactForm");
  const note = $("#formNote");

  const setError = (input, message) => {
    const field = input.closest(".field");
    const errorEl = $('[data-error-for="' + input.id + '"]');
    field.classList.toggle("invalid", Boolean(message));
    if (errorEl) errorEl.textContent = message || "";
  };

  const validateField = (input) => {
    const value = input.value.trim();

    if (!value) {
      setError(input, "Kolom ini wajib diisi.");
      return false;
    }

    if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(input, "Format email belum benar.");
      return false;
    }

    if (input.id === "message" && value.length < 10) {
      setError(input, "Tuliskan minimal 10 karakter.");
      return false;
    }

    setError(input, "");
    return true;
  };

  if (form) {
    const inputs = $$("input, textarea", form);

    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) validateField(input);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const allValid = inputs.map(validateField).every(Boolean);

      if (!allValid) {
        note.textContent = "Mohon periksa kembali kolom yang ditandai.";
        note.className = "form-note fail";
        const firstInvalid = $(".field.invalid input, .field.invalid textarea", form);
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const submitBtn = $("button[type='submit']", form);
      submitBtn.disabled = true;
      submitBtn.textContent = "Mengirim...";

      // Simulasi pengiriman. Ganti dengan permintaan jaringan sungguhan.
      setTimeout(() => {
        note.textContent = "Terima kasih! Pesan Anda sudah terkirim.";
        note.className = "form-note ok";
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Pesan";

        setTimeout(() => {
          note.textContent = "";
          note.className = "form-note";
        }, 6000);
      }, 900);
    });
  }

  /* ---------------------------------------------------------
     10. Tombol kembali ke atas
     --------------------------------------------------------- */
  const toTop = $("#toTop");

  const onScrollTop = () => {
    if (!toTop) return;
    toTop.classList.toggle("show", window.scrollY > 600);
  };
  onScrollTop();
  window.addEventListener("scroll", onScrollTop, { passive: true });

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
