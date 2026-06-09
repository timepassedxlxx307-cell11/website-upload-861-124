(function () {
    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
            menuButton.textContent = mobileNav.classList.contains('is-open') ? '×' : '☰';
        });
    }

    function applyFilters(scope) {
        var queryInputs = scope.querySelectorAll('[data-search-input]');
        var typeSelect = scope.querySelector('[data-filter-type]');
        var yearSelect = scope.querySelector('[data-filter-year]');
        var query = '';

        queryInputs.forEach(function (input) {
            if (input.value) {
                query = input.value;
            }
        });

        query = normalize(query);
        var typeValue = normalize(typeSelect ? typeSelect.value : '');
        var yearValue = normalize(yearSelect ? yearSelect.value : '');
        var cards = document.querySelectorAll('[data-movie-card]');

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-tags')
            ].join(' '));
            var matchesQuery = !query || haystack.indexOf(query) !== -1;
            var matchesType = !typeValue || normalize(card.getAttribute('data-type')).indexOf(typeValue) !== -1;
            var matchesYear = !yearValue || normalize(card.getAttribute('data-year')) === yearValue;
            card.classList.toggle('is-hidden', !(matchesQuery && matchesType && matchesYear));
        });
    }

    var searchInputs = document.querySelectorAll('[data-search-input]');
    var filterControls = document.querySelectorAll('[data-filter-type], [data-filter-year]');

    searchInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            var value = input.value;
            searchInputs.forEach(function (other) {
                if (other !== input) {
                    other.value = value;
                }
            });
            applyFilters(document);
        });
    });

    filterControls.forEach(function (control) {
        control.addEventListener('change', function () {
            applyFilters(document);
        });
    });

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startTimer();
            });
        });

        if (slides.length > 1) {
            startTimer();
        }
    }
})();
