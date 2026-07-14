// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Sticky header shadow on scroll
const header = document.getElementById("siteHeader");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 12);

  const backToTop = document.getElementById("backToTop");
  backToTop.classList.toggle("visible", window.scrollY > 480);
});

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Scroll reveal animation
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

// Hero stat count-up animation
const countEls = document.querySelectorAll(".count-num");
if (countEls.length) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  countEls.forEach((el) => countObserver.observe(el));
}

// Pin save/favorite buttons (recipes/blog)
document.querySelectorAll(".pin-save").forEach((btn) => {
  const key = `sustenhance_saved_${btn.dataset.id}`;
  if (localStorage.getItem(key)) {
    btn.classList.add("saved");
    btn.textContent = "Saved";
  }
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const saved = btn.classList.toggle("saved");
    btn.textContent = saved ? "Saved" : "Save";
    btn.classList.remove("pop");
    void btn.offsetWidth;
    btn.classList.add("pop");
    if (saved) {
      localStorage.setItem(key, "1");
    } else {
      localStorage.removeItem(key);
    }
  });
});

// Category filter bars (blog/recipes)
document.querySelectorAll(".filter-bar").forEach((bar) => {
  const grid = document.querySelector(bar.dataset.target);
  if (!grid) return;
  const buttons = bar.querySelectorAll(".filter-btn");
  const cards = grid.querySelectorAll("[data-category]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("filter-hidden", !match);
      });
    });
  });
});

// Testimonials carousel
const track = document.getElementById("testimonialTrack");
if (track) {
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  const dotsWrap = document.getElementById("testimonialDots");
  const carousel = document.getElementById("testimonialsCarousel");
  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, 6000);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  nextBtn.addEventListener("click", () => { next(); startAutoplay(); });
  prevBtn.addEventListener("click", () => { prev(); startAutoplay(); });
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  render();
  startAutoplay();
}

// Staggered reveal delay per grid item
document.querySelectorAll(
  ".services-grid, .resources-grid, .process-grid, .blog-grid, .recipe-grid, .calculator-grid"
).forEach((grid) => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.setProperty("--stagger-i", i);
  });
});

// Auto-tilt: mark visual (non-form) cards as interactive tilt targets
document
  .querySelectorAll(
    ".service-card, .resource-card, .blog-card, .recipe-card, .testimonial-card, .hero-card"
  )
  .forEach((el) => el.classList.add("tilt"));

// 3D tilt-on-hover for cards (skipped on touch/coarse pointers)
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (-y * 7).toFixed(2);
      const rotateY = (x * 7).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.015)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Magnetic pull for primary buttons
  document.querySelectorAll(".btn-primary").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${(x * 0.15).toFixed(2)}px, ${(y * 0.25 - 3).toFixed(2)}px) scale(1.02)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

// Cursor-follow spotlight glow in the hero
const heroSpotlight = document.getElementById("heroSpotlight");
if (heroSpotlight) {
  const heroSection = heroSpotlight.closest(".hero");
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroSection.style.setProperty("--spot-x", `${x}%`);
    heroSection.style.setProperty("--spot-y", `${y}%`);
  });
}
