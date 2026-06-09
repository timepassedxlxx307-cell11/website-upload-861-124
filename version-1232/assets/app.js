const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
    return;
  }
  callback();
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const bootMenu = () => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  if (!toggle || !panel) {
    return;
  }
  toggle.addEventListener("click", () => {
    panel.classList.toggle("open");
  });
};

const bootHero = () => {
  const hero = document.querySelector("[data-hero]");
  if (!hero) {
    return;
  }
  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  const prev = hero.querySelector("[data-hero-prev]");
  const next = hero.querySelector("[data-hero-next]");
  if (!slides.length) {
    return;
  }
  let index = 0;
  let timer = null;
  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, current) => {
      slide.classList.toggle("active", current === index);
    });
    dots.forEach((dot, current) => {
      dot.classList.toggle("active", current === index);
    });
  };
  const play = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(index + 1), 6500);
  };
  prev?.addEventListener("click", () => {
    show(index - 1);
    play();
  });
  next?.addEventListener("click", () => {
    show(index + 1);
    play();
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      show(Number(dot.dataset.heroDot || 0));
      play();
    });
  });
  hero.addEventListener("mouseenter", () => window.clearInterval(timer));
  hero.addEventListener("mouseleave", play);
  show(0);
  play();
};

const applyFilters = () => {
  const grids = Array.from(document.querySelectorAll("[data-filter-grid]"));
  if (!grids.length) {
    return;
  }
  const queryInput = document.querySelector('[data-grid-filter="query"]');
  const yearInput = document.querySelector('[data-grid-filter="year"]');
  const typeInput = document.querySelector('[data-grid-filter="type"]');
  const query = normalize(queryInput?.value);
  const year = normalize(yearInput?.value);
  const type = normalize(typeInput?.value);
  grids.forEach((grid) => {
    Array.from(grid.querySelectorAll("[data-movie-card]")).forEach((card) => {
      const text = normalize(card.dataset.search || card.textContent);
      const cardYear = normalize(card.dataset.year);
      const cardType = normalize(card.dataset.type);
      const matched = (!query || text.includes(query)) && (!year || cardYear === year) && (!type || cardType === type);
      card.classList.toggle("hidden", !matched);
    });
  });
};

const bootFilters = () => {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") || "";
  const pageInput = document.querySelector(".search-page-input");
  if (pageInput && q) {
    pageInput.value = q;
  }
  Array.from(document.querySelectorAll("[data-grid-filter]")).forEach((field) => {
    field.addEventListener("input", applyFilters);
    field.addEventListener("change", applyFilters);
  });
  applyFilters();
};

const attachStream = async (video, videoUrl) => {
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoUrl;
    return;
  }
  const module = await import("./hls.js");
  const Hls = module.H;
  if (Hls && Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoUrl);
    hls.attachMedia(video);
    video.hlsInstance = hls;
    return;
  }
  video.src = videoUrl;
};

export const initializeMoviePlayer = (videoUrl) => {
  ready(() => {
    const video = document.getElementById("movieVideo");
    const overlay = document.getElementById("playerOverlay");
    if (!video || !overlay || !videoUrl) {
      return;
    }
    let readyToPlay = false;
    let loading = false;
    const start = async () => {
      overlay.classList.add("is-loading");
      if (!readyToPlay && !loading) {
        loading = true;
        await attachStream(video, videoUrl);
        readyToPlay = true;
        loading = false;
      }
      overlay.classList.add("is-hidden");
      video.controls = true;
      try {
        await video.play();
      } catch (error) {
        video.controls = true;
      }
    };
    overlay.addEventListener("click", start);
    video.addEventListener("click", () => {
      if (video.paused) {
        start();
      }
    });
  });
};

ready(() => {
  bootMenu();
  bootHero();
  bootFilters();
});
