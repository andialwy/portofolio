/* =========================================================
   Creative Portfolio — Andi Al Musyawir
   ========================================================= */

(function () {
  "use strict";

  // Update Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal Animations on Scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // Parallax Effect for Hero Background Text
  window.addEventListener("scroll", () => {
    const bgText = document.querySelector(".hero-bg-text");
    if (bgText) {
      const scroll = window.pageYOffset;
      bgText.style.transform = `translate(-50%, calc(-50% + ${scroll * 0.1}px))`;
    }
  });

  // Mobile Menu Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("active");
    });
  }

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
        // Close mobile menu if open
        if (navLinks) navLinks.classList.remove("open");
      }
    });
  });

})();
