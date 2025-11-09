// Smooth scroll setup
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ----------------------------
// Utility: Load HTML components
// ----------------------------
async function loadComponent(id, path) {
  const el = document.getElementById(id);
  if (!el) return; // Skip if not present
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(`Error loading component: ${id}`, err);
  }
}

// ----------------------------
// Header auto-hide on scroll
// ----------------------------
function setupHeaderAutoHide() {
  const findNav = () =>
    document.querySelector(".navbar") || document.querySelector("header");
  let nav = findNav();
  if (!nav) {
    const mo = new MutationObserver(() => {
      nav = findNav();
      if (nav) {
        mo.disconnect();
        setupHeaderAutoHide();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return;
  }

  if (!nav.style.transition) nav.style.transition = "transform 280ms ease";
  let lastY = window.scrollY;
  let ticking = false;
  const THRESHOLD = 150;

  function update() {
    const y = window.scrollY;
    nav.classList.toggle("navbar--hidden", y > lastY && y > THRESHOLD);
    lastY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
}

// ----------------------------
// Reveal Mask (mouse-follow)
// ----------------------------
function initAchieveReveal() {
  const right = document.querySelector("#achieve .right");
  if (!right || right.dataset.revealInit) return;
  right.dataset.revealInit = "1";

  const overlay = document.createElement("div");
  overlay.className = "reveal-overlay";
  right.appendChild(overlay);

  right.querySelectorAll("span").forEach((s) => {
    overlay.appendChild(s.cloneNode(true));
  });

  const radius = 100;
  const move = (x, y) =>
    (overlay.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`);

  function handleMove(e) {
    const rect = right.getBoundingClientRect();
    move(e.clientX - rect.left, e.clientY - rect.top);
  }

  right.addEventListener("mouseenter", (e) => {
    right.classList.add("reveal-active");
    handleMove(e);
  });
  right.addEventListener("mousemove", handleMove);
  right.addEventListener("mouseleave", () => {
    overlay.style.clipPath = "circle(0px at 0 0)";
    right.classList.remove("reveal-active");
  });
}

// ----------------------------
// Accordion toggle
// ----------------------------
function initAccordion() {
  const acc = document.querySelector(".accordion");
  if (!acc) return;

  acc.addEventListener("click", (e) => {
    const header = e.target.closest(".accordion-header");
    if (!header) return;
    const item = header.parentElement;
    const isActive = item.classList.contains("active");

    acc
      .querySelectorAll(".accordion-item")
      .forEach((i) => i.classList.remove("active"));

    if (!isActive) item.classList.add("active");
  });
}

// ----------------------------
// Tab logic (counter-types)
// ----------------------------
function initTabs() {
  const scope = document.getElementById("counter-types");
  if (!scope) return;

  const tabs = Array.from(scope.querySelectorAll('[role="tab"]'));
  const panels = Array.from(scope.querySelectorAll('[role="tabpanel"]'));

  function activate(tab) {
    const control = tab.getAttribute("aria-controls");
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active);
    });
    panels.forEach((p) => {
      const show = p.id === control;
      p.toggleAttribute("hidden", !show);
      p.setAttribute("aria-hidden", !show);
    });
  }

  scope.addEventListener("click", (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) activate(tab);
  });

  scope.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const idx = tabs.indexOf(active);
    if (idx === -1) return;

    if (e.key === "ArrowRight") activate(tabs[(idx + 1) % tabs.length]);
    if (e.key === "ArrowLeft")
      activate(tabs[(idx - 1 + tabs.length) % tabs.length]);
    if (e.key === "Home") activate(tabs[0]);
    if (e.key === "End") activate(tabs[tabs.length - 1]);
  });
}

// ----------------------------
// Swiper (only if present)
// ----------------------------
function initSwiper() {
  const el = document.querySelector(".carousel .swiper");
  if (!el) return;
  new Swiper(el, {
    loop: true,
    effect: "fade",
    speed: 1000,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
  });
}

// ----------------------------
// Init all
// ----------------------------
async function init() {
  const page = document.body.dataset.page || "";

  await Promise.all([
    loadComponent("header", "/components/header.html"),
    loadComponent("footer", "/components/footer.html"),
    loadComponent("how-we-work", "/components/how-we-work.html"),
    loadComponent("case-studies", "/components/case-studies.html"),
    loadComponent("partners", "/components/partners.html"),
  ]);

  setupHeaderAutoHide();
  initAchieveReveal();
  initAccordion();
  initTabs();
  initSwiper();

  try {
    const common = await import("./modules/common.js");
    if (["about", "services", "client-success"].includes(page)) {
      common.fadeContentAnimation?.();
      common.commonCarousel?.();
    }
    if (page === "home") {
      const home = await import("./modules/home.js");
      home.gsapAnimation?.();
      home.carousels?.();
      common.commonCarousel?.();
    }
  } catch (err) {
    console.error("Failed loading page module", err);
  }
}

document.addEventListener("DOMContentLoaded", init);
