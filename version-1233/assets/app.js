(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var toggle = qs('[data-mobile-toggle]');
  var panel = qs('[data-mobile-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var hero = qs('[data-hero]');
  if (hero) {
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var current = 0;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function applyFilters(scope) {
    var input = qs('[data-search-input]', scope);
    var region = qs('[data-filter-region]', scope);
    var type = qs('[data-filter-type]', scope);
    var year = qs('[data-filter-year]', scope);
    var cards = qsa('[data-movie-card]', scope);

    if (!cards.length) {
      return;
    }

    function value(node) {
      return node ? node.value.trim().toLowerCase() : '';
    }

    function update() {
      var word = value(input);
      var r = value(region);
      var t = value(type);
      var y = value(year);
      cards.forEach(function (card) {
        var index = (card.getAttribute('data-search-index') || '').toLowerCase();
        var cardRegion = (card.getAttribute('data-region') || index).toLowerCase();
        var cardType = (card.getAttribute('data-type') || index).toLowerCase();
        var cardYear = (card.getAttribute('data-year') || index).toLowerCase();
        var ok = true;
        if (word && index.indexOf(word) === -1) {
          ok = false;
        }
        if (r && cardRegion.indexOf(r) === -1 && index.indexOf(r) === -1) {
          ok = false;
        }
        if (t && cardType.indexOf(t) === -1 && index.indexOf(t) === -1) {
          ok = false;
        }
        if (y && cardYear.indexOf(y) === -1 && index.indexOf(y) === -1) {
          ok = false;
        }
        card.classList.toggle('is-hidden', !ok);
      });
    }

    [input, region, type, year].forEach(function (node) {
      if (node) {
        node.addEventListener('input', update);
        node.addEventListener('change', update);
      }
    });
  }

  qsa('[data-movie-grid]').forEach(function (grid) {
    var section = grid.closest('section') || document;
    applyFilters(section);
  });

  window.startMoviePlayer = function (id, source) {
    var root = document.getElementById(id);
    if (!root) {
      return;
    }
    var video = qs('video', root);
    var overlay = qs('.player-overlay', root);
    var hlsInstance = null;
    var started = false;

    function begin() {
      if (!video || !source) {
        return;
      }
      if (!started) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
        started = true;
      }
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', begin);
    }
    video.addEventListener('click', function () {
      if (!started) {
        begin();
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
