(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function() {
        panel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-search-form]").forEach(function(form) {
      form.addEventListener("submit", function(event) {
        var input = form.querySelector('input[name="q"]');
        if (!input) {
          return;
        }
        var query = input.value.trim();
        event.preventDefault();
        window.location.href = query ? "movies.html?q=" + encodeURIComponent(query) : "movies.html";
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function(dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function play() {
        stop();
        timer = window.setInterval(function() {
          show(current + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
        }
      }

      if (prev) {
        prev.addEventListener("click", function(event) {
          event.preventDefault();
          show(current - 1);
          play();
        });
      }

      if (next) {
        next.addEventListener("click", function(event) {
          event.preventDefault();
          show(current + 1);
          play();
        });
      }

      dots.forEach(function(dot, dotIndex) {
        dot.addEventListener("click", function(event) {
          event.preventDefault();
          show(dotIndex);
          play();
        });
      });

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", play);
      show(0);
      play();
    }

    var filterPanel = document.querySelector("[data-filter-panel]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var empty = document.querySelector("[data-filter-empty]");

    if (filterPanel && cards.length) {
      var keyword = filterPanel.querySelector("[data-filter-keyword]");
      var type = filterPanel.querySelector("[data-filter-type]");
      var region = filterPanel.querySelector("[data-filter-region]");
      var year = filterPanel.querySelector("[data-filter-year]");
      var clear = filterPanel.querySelector("[data-filter-clear]");

      function valueOf(control) {
        return control ? control.value.trim().toLowerCase() : "";
      }

      function cardText(card) {
        return [
          card.dataset.title || "",
          card.dataset.region || "",
          card.dataset.year || "",
          card.dataset.type || "",
          card.dataset.tags || ""
        ].join(" ").toLowerCase();
      }

      function applyFilters() {
        var kw = valueOf(keyword);
        var selectedType = valueOf(type);
        var selectedRegion = valueOf(region);
        var selectedYear = valueOf(year);
        var visible = 0;

        cards.forEach(function(card) {
          var text = cardText(card);
          var isVisible = true;

          if (kw && text.indexOf(kw) === -1) {
            isVisible = false;
          }
          if (selectedType && (card.dataset.type || "").toLowerCase().indexOf(selectedType) === -1) {
            isVisible = false;
          }
          if (selectedRegion && (card.dataset.region || "").toLowerCase().indexOf(selectedRegion) === -1) {
            isVisible = false;
          }
          if (selectedYear && (card.dataset.year || "").toLowerCase() !== selectedYear) {
            isVisible = false;
          }

          card.hidden = !isVisible;
          if (isVisible) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [keyword, type, region, year].forEach(function(control) {
        if (control) {
          control.addEventListener("input", applyFilters);
          control.addEventListener("change", applyFilters);
        }
      });

      if (clear) {
        clear.addEventListener("click", function() {
          [keyword, type, region, year].forEach(function(control) {
            if (control) {
              control.value = "";
            }
          });
          applyFilters();
        });
      }

      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q && keyword) {
        keyword.value = q;
      }
      applyFilters();
    }
  });
})();
