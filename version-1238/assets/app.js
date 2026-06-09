(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var active = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === active);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(active - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          start();
        });
      }

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));

    inputs.forEach(function (input) {
      var root = input.closest("section") || document;
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
      var clear = root.querySelector("[data-clear-search]");

      function filterCards() {
        var value = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var haystack = [card.getAttribute("data-title"), card.getAttribute("data-tags"), card.textContent].join(" ").toLowerCase();
          card.classList.toggle("hidden", value.length > 0 && haystack.indexOf(value) === -1);
        });
      }

      input.addEventListener("input", filterCards);

      if (clear) {
        clear.addEventListener("click", function () {
          input.value = "";
          filterCards();
          input.focus();
        });
      }
    });

    var chipGroups = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chips]"));

    chipGroups.forEach(function (group) {
      var root = group.closest("section") || document;
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
      var chips = Array.prototype.slice.call(group.querySelectorAll("[data-filter]"));

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          var value = chip.getAttribute("data-filter") || "全部";
          chips.forEach(function (item) {
            item.classList.toggle("active", item === chip);
          });
          cards.forEach(function (card) {
            var haystack = [card.getAttribute("data-title"), card.getAttribute("data-tags"), card.textContent].join(" ");
            card.classList.toggle("hidden", value !== "全部" && haystack.indexOf(value) === -1);
          });
        });
      });
    });
  });
})();
