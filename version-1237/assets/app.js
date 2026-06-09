(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var hero = document.querySelector('.hero-carousel');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
        startTimer();
      });
    });

    startTimer();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));

  panels.forEach(function (panel) {
    var input = panel.querySelector('.search-input');
    var select = panel.querySelector('.filter-select');
    var container = panel.parentElement;
    var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var category = select ? select.value : '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category')
        ].join(' ').toLowerCase();
        var cardCategory = card.getAttribute('data-category') || '';
        var matchKeyword = keyword === '' || text.indexOf(keyword) !== -1;
        var matchCategory = category === '' || cardCategory === category;

        card.classList.toggle('is-filter-hidden', !(matchKeyword && matchCategory));
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (select) {
      select.addEventListener('change', applyFilter);
    }
  });
}());

function initMoviePlayer(source) {
  var video = document.getElementById('movie-player');
  var overlay = document.getElementById('player-overlay');
  var initialized = false;
  var hls = null;

  if (!video) {
    return;
  }

  function attachStream() {
    if (initialized) {
      return;
    }

    initialized = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function beginPlayback() {
    attachStream();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var attempt = video.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', beginPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      beginPlayback();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
}
