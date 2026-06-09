(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', () => {
      mobilePanel.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  const prev = document.querySelector('[data-hero-prev]');
  const next = document.querySelector('[data-hero-next]');
  let activeSlide = 0;
  let timer = null;

  const showSlide = (index) => {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === activeSlide);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeSlide);
    });
  };

  const startHero = () => {
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => showSlide(activeSlide + 1), 5200);
  };

  if (slides.length) {
    showSlide(0);
    startHero();
    if (prev) {
      prev.addEventListener('click', () => {
        showSlide(activeSlide - 1);
        startHero();
      });
    }
    if (next) {
      next.addEventListener('click', () => {
        showSlide(activeSlide + 1);
        startHero();
      });
    }
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        showSlide(dotIndex);
        startHero();
      });
    });
  }

  const filterScopes = Array.from(document.querySelectorAll('[data-filter-scope]'));

  filterScopes.forEach((scope) => {
    const searchInput = scope.querySelector('[data-card-search]');
    const selects = Array.from(scope.querySelectorAll('[data-filter-select]'));
    const cards = Array.from(scope.querySelectorAll('[data-filter-card]'));
    const empty = scope.querySelector('[data-filter-empty]');

    const applyFilter = () => {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const values = selects.map((select) => ({
        field: select.getAttribute('data-filter-select'),
        value: select.value
      }));
      let visibleCount = 0;

      cards.forEach((card) => {
        const text = (card.getAttribute('data-search') || '').toLowerCase();
        const matchesText = !query || text.includes(query);
        const matchesSelects = values.every((item) => {
          if (!item.value) {
            return true;
          }
          return (card.getAttribute(`data-${item.field}`) || '') === item.value;
        });
        const visible = matchesText && matchesSelects;
        card.style.display = visible ? '' : 'none';
        if (visible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visibleCount === 0);
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }
    selects.forEach((select) => select.addEventListener('change', applyFilter));
    applyFilter();
  });

  const playerShell = document.querySelector('[data-player]');

  if (playerShell) {
    const video = playerShell.querySelector('video');
    const layer = playerShell.querySelector('[data-player-layer]');
    const playButton = playerShell.querySelector('[data-player-button]');
    const videoUrl = playerShell.getAttribute('data-url');
    let hlsObject = null;
    let loaded = false;

    const startVideo = () => {
      if (!video || !videoUrl) {
        return;
      }

      if (!loaded) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = videoUrl;
          loaded = true;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsObject = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsObject.loadSource(videoUrl);
          hlsObject.attachMedia(video);
          loaded = true;
        }
      }

      if (layer) {
        layer.classList.add('hide');
      }

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          if (layer) {
            layer.classList.remove('hide');
          }
        });
      }
    };

    if (playButton) {
      playButton.addEventListener('click', (event) => {
        event.stopPropagation();
        startVideo();
      });
    }
    if (layer) {
      layer.addEventListener('click', startVideo);
    }
    if (video) {
      video.addEventListener('click', () => {
        if (video.paused) {
          startVideo();
        }
      });
      video.addEventListener('play', () => {
        if (layer) {
          layer.classList.add('hide');
        }
      });
    }

    window.addEventListener('pagehide', () => {
      if (hlsObject) {
        hlsObject.destroy();
        hlsObject = null;
      }
    });
  }
})();
