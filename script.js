/* =========================================================
   ZAIBA MUSKAN — PORTFOLIO INTERACTIONS
   Theme · mobile navigation · project tabs · particles
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;

  // THEME TOGGLE
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle?.querySelector("i");

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("theme") || "dark";
  } catch (_) {}

  function setTheme(theme) {
    const selectedTheme = theme === "light" ? "light" : "dark";

    html.setAttribute("data-theme", selectedTheme);

    try {
      localStorage.setItem("theme", selectedTheme);
    } catch (_) {}

    if (themeIcon) {
      themeIcon.classList.toggle("fa-sun", selectedTheme === "dark");
      themeIcon.classList.toggle("fa-moon", selectedTheme === "light");
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        selectedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  setTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    setTheme(html.getAttribute("data-theme") === "light" ? "dark" : "light");
  });

  // MOBILE NAVIGATION
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  function closeMobileMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-xmark", "fa-times");
      icon.classList.add("fa-bars");
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      const icon = menuToggle.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
        icon.classList.remove("fa-times");
      }
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMobileMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMobileMenu();
    });
  }

  // SMOOTH SCROLLING
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      const href = anchor.getAttribute("href");

      if (!href || href === "#") return;

      let target;

      try {
        target = document.querySelector(href);
      } catch (_) {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    });
  });

  // PROJECT CATEGORY TABS
  window.showProjectCategory = function(category, event) {
    const target = document.getElementById(category + "-projects");
    const section = document.getElementById("projects");

    if (!target || !section) return;

    section.querySelectorAll(".project-category").forEach(panel => {
      panel.classList.remove("active");
    });

    section.querySelectorAll(".project-tab").forEach(tab => {
      tab.classList.remove("active");
    });

    target.classList.add("active");

    if (event?.currentTarget) {
      event.currentTarget.classList.add("active");
    }

    const subtabs = section.querySelector(".project-subtabs");

    if (subtabs) {
      subtabs.style.display = category === "software" ? "flex" : "none";
    }

    if (category === "software") {
      const activeGrid = section.querySelector(".software-sub-grid.active");

      if (!activeGrid) {
        window.showSoftwareSubCategory("ml");
      }
    } else {
      section.querySelectorAll(".software-sub-grid").forEach(grid => {
        grid.classList.remove("active");
      });
    }
  };

  // SOFTWARE SUBCATEGORY TABS
  window.showSoftwareSubCategory = function(subCategory, event) {
    document.querySelectorAll(".software-sub-grid").forEach(grid => {
      grid.classList.remove("active");
    });

    document.querySelectorAll(".subtab").forEach(tab => {
      tab.classList.remove("active");
    });

    const target = document.getElementById(subCategory + "-software");

    if (target) target.classList.add("active");

    let selectedTab = event?.currentTarget;

    if (!selectedTab) {
      selectedTab = Array.from(document.querySelectorAll(".subtab")).find(tab =>
        (tab.getAttribute("onclick") || "").includes(subCategory)
      );
    }

    if (selectedTab) selectedTab.classList.add("active");
  };

  // PROJECT CAROUSELS
  const carouselPositions = {};

  window.moveCarousel = function(trackId, direction) {
    const track = document.getElementById("track-" + trackId);

    if (!track) return;

    const cards = track.querySelectorAll(".project-card");

    if (cards.length < 2) return;

    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 0;
    const step = cards[0].getBoundingClientRect().width + gap;

    const wrapper = track.parentElement;

    if (!wrapper) return;

    const maxOffset = Math.max(
      0,
      track.scrollWidth - wrapper.clientWidth
    );

    const maxIndex = Math.max(0, cards.length - 1);

    carouselPositions[trackId] = Math.max(
      0,
      Math.min(
        (carouselPositions[trackId] || 0) + direction,
        maxIndex
      )
    );

    const offset = Math.min(
      carouselPositions[trackId] * step,
      maxOffset
    );

    track.style.transform = `translateX(-${offset}px)`;
  };

  // SHOW MORE / LESS
  window.toggleDescription = function(button) {
    if (!button) return;

    const description = button.closest(".project-description");

    if (!description) return;

    const fullDescription = description.querySelector(".full-desc");

    if (!fullDescription) return;

    const isHidden =
      window.getComputedStyle(fullDescription).display === "none";

    fullDescription.style.display = isHidden ? "inline" : "none";
    button.textContent = isHidden ? "Show Less" : "Show More";
    button.setAttribute("aria-expanded", String(isHidden));
  };

  // PUBLICATION TABS
  window.showPublicationCategory = function(category, event) {
    const section = document.getElementById("publications");
    const target = document.getElementById(category + "-publications");

    if (!section || !target) return;

    section.querySelectorAll(".project-category").forEach(panel => {
      panel.classList.remove("active");
    });

    section.querySelectorAll(".project-tab").forEach(tab => {
      tab.classList.remove("active");
    });

    target.classList.add("active");

    if (event?.currentTarget) {
      event.currentTarget.classList.add("active");
    }
  };

  // SUBTLE SCROLL REVEALS
  const revealTargets = document.querySelectorAll(
    ".section .project-card, " +
    ".section .skill-category, " +
    ".section .experience-card, " +
    ".section .community-card, " +
    ".section .education-mini"
  );

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12
    });

    revealTargets.forEach(element => {
      element.classList.add("reveal-on-scroll");
      observer.observe(element);
    });
  }

  // ROSE AND LILAC PARTICLE BACKGROUND
  (function initParticles() {
    const canvas = document.getElementById("particle-canvas");

    if (
      !canvas ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let particles = [];
    let resizeTimeout;

    const colors = [
      "243, 168, 200",
      "201, 184, 255",
      "255, 220, 236"
    ];

    const isMobile = () => window.innerWidth < 700;

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = isMobile() ? 24 : 54;

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.28 + 0.08,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(${particle.color}, ${particle.alpha})`;

        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = isMobile() ? 75 : 105;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);

            ctx.strokeStyle =
              `rgba(243, 168, 200, ${(1 - distance / maxDistance) * 0.075})`;

            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
      window.cancelAnimationFrame(animationFrame);
      animate();
    }

    resizeCanvas();
    startAnimation();

    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimeout);

      resizeTimeout = window.setTimeout(() => {
        resizeCanvas();
      }, 120);
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else {
        startAnimation();
      }
    });
  })();

  console.log("Zaiba Muskan's portfolio initialized.");
});

/* =========================================
   FLOATING BLOSSOMS — HERO INTERACTION
   ========================================= */

(() => {
  const hero = document.querySelector("#home");
  const container = document.querySelector("#hero-blossoms");

  if (!hero || !container) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const symbols = ["✿", "❀", "✽", "✿"];
  const count = window.innerWidth < 600 ? 18 : 32;
  const blossoms = [];
  const pointer = { x: 0, y: 0, active: false };

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "blossom-particle";
    el.textContent = symbols[i % symbols.length];

    const size = 9 + Math.random() * 11;

    const blossom = {
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size,
      speed: 0.12 + Math.random() * 0.3,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.006 + Math.random() * 0.012,
      drift: 0.15 + Math.random() * 0.45,
      depth: 0.3 + Math.random() * 0.7,
      rotation: Math.random() * 360
    };

    el.style.fontSize = `${size}px`;
    el.style.opacity = `${0.22 + Math.random() * 0.48}`;
    container.appendChild(el);
    blossoms.push(blossom);
  }

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });

  hero.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  let animationFrame;

  function animate() {
    const width = hero.clientWidth;
    const height = hero.clientHeight;

    for (const b of blossoms) {
      b.sway += b.swaySpeed;

      if (!reducedMotion) {
        b.y -= b.speed;
        b.x += Math.sin(b.sway) * b.drift;

        if (pointer.active) {
          const dx = b.x - pointer.x;
          const dy = b.y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const radius = 130;

          if (distance < radius && distance > 0) {
            const force = ((radius - distance) / radius) * 1.5;
            b.x += (dx / distance) * force;
            b.y += (dy / distance) * force;
          }
        }

        if (b.y < -30) {
          b.y = height + 20;
          b.x = Math.random() * width;
        }

        if (b.x < -25) b.x = width + 20;
        if (b.x > width + 25) b.x = -20;
      }

      b.el.style.transform =
        `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.rotation + b.sway * 12}deg)`;

      b.el.style.opacity = `${0.2 + b.depth * 0.5}`;
    }

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  animate();

  window.addEventListener("pagehide", () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
})();
