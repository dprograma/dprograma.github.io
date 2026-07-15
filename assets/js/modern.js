/* Kennedy Egwuda — portfolio interactions (dependency-free) */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
  const themeBtn = document.getElementById("theme-toggle");
  function syncThemeIcon() {
    if (!themeBtn) return;
    const dark = root.getAttribute("data-theme") !== "light";
    themeBtn.innerHTML = dark ? '<i class="bx bx-sun"></i>' : '<i class="bx bx-moon"></i>';
  }
  syncThemeIcon();
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const dark = root.getAttribute("data-theme") !== "light";
      root.setAttribute("data-theme", dark ? "light" : "dark");
      localStorage.setItem("theme", dark ? "light" : "dark");
      syncThemeIcon();
    });
  }

  /* ---------- Navbar scroll ---------- */
  const nav = document.querySelector(".nav");
  const toTop = document.querySelector(".to-top");
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 24);
    if (toTop) toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      navToggle.innerHTML = navLinks.classList.contains("open")
        ? '<i class="bx bx-x"></i>' : '<i class="bx bx-menu"></i>';
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.innerHTML = '<i class="bx bx-menu"></i>';
      });
    });
  }

  /* ---------- Back to top ---------- */
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  function revealNow(el) { el.classList.add("in"); }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { revealNow(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      // Anything already within (or above) the viewport on load reveals immediately.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) revealNow(el);
      else io.observe(el);
    });
    // Failsafe: never let content stay hidden if the observer misfires.
    setTimeout(function () { reveals.forEach(revealNow); }, 2600);
  } else {
    reveals.forEach(revealNow);
  }

  /* ---------- Stat counters ---------- */
  const nums = document.querySelectorAll("[data-count]");
  if (nums.length && "IntersectionObserver" in window) {
    const io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el = e.target, target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
        const dec = (target % 1 !== 0) ? 1 : 0;
        let t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / 1600, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io2.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io2.observe(n); });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  const linkMap = {};
  document.querySelectorAll(".nav-links a[href^='#']").forEach(function (a) {
    linkMap[a.getAttribute("href").slice(1)] = a;
  });
  if (sections.length) {
    const io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          Object.values(linkMap).forEach(function (a) { a.classList.remove("active"); });
          const link = linkMap[e.target.id];
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { io3.observe(s); });
  }

  /* ---------- Project filter ---------- */
  const filterBtns = document.querySelectorAll(".filters button");
  const cards = document.querySelectorAll(".p-card");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      const f = btn.dataset.filter;
      cards.forEach(function (c) {
        const show = f === "all" || c.dataset.cat.split(" ").indexOf(f) > -1;
        c.style.display = show ? "" : "none";
        if (show) { c.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 350, easing: "ease" }); }
      });
    });
  });

  /* ---------- Typed effect ---------- */
  const typedEl = document.querySelector("[data-typed]");
  if (typedEl) {
    const items = JSON.parse(typedEl.getAttribute("data-typed"));
    let ii = 0, ci = 0, deleting = false;
    const cursor = document.createElement("span");
    cursor.className = "typed-cursor"; cursor.textContent = "|";
    typedEl.after(cursor);
    (function tick() {
      const word = items[ii];
      typedEl.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) { ci++; setTimeout(tick, 75); }
      else if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 1600); }
      else if (deleting && ci > 0) { ci--; setTimeout(tick, 38); }
      else { deleting = false; ii = (ii + 1) % items.length; setTimeout(tick, 350); }
    })();
  }

  /* ---------- Footer year ---------- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
