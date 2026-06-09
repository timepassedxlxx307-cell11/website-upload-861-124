(function() {
    var mobileButton = document.querySelector('[data-mobile-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (mobileButton && mobileMenu) {
        mobileButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function play() {
            timer = window.setInterval(function() {
                showSlide(index + 1);
            }, 5000);
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            play();
        }

        if (prev) {
            prev.addEventListener('click', function(event) {
                event.preventDefault();
                showSlide(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function(event) {
                event.preventDefault();
                showSlide(index + 1);
                restart();
            });
        }

        dots.forEach(function(dot) {
            dot.addEventListener('click', function(event) {
                event.preventDefault();
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        showSlide(0);
        play();
    }

    var filterAreas = Array.prototype.slice.call(document.querySelectorAll('[data-filter-area]'));

    filterAreas.forEach(function(area) {
        var input = area.querySelector('[data-filter-input]');
        var typeSelect = area.querySelector('[data-filter-type]');
        var yearSelect = area.querySelector('[data-filter-year]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
        var empty = document.querySelector('[data-empty-state]');

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function cardValue(card, name) {
            return normalize(card.getAttribute('data-' + name));
        }

        function filterCards() {
            var query = normalize(input && input.value);
            var type = normalize(typeSelect && typeSelect.value);
            var year = normalize(yearSelect && yearSelect.value);
            var visible = 0;

            cards.forEach(function(card) {
                var text = [
                    cardValue(card, 'title'),
                    cardValue(card, 'genre'),
                    cardValue(card, 'region'),
                    cardValue(card, 'type'),
                    cardValue(card, 'year')
                ].join(' ');
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchType = !type || cardValue(card, 'type') === type;
                var matchYear = !year || cardValue(card, 'year') === year;
                var shouldShow = matchQuery && matchType && matchYear;

                card.style.display = shouldShow ? '' : 'none';
                if (shouldShow) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [input, typeSelect, yearSelect].forEach(function(control) {
            if (control) {
                control.addEventListener('input', filterCards);
                control.addEventListener('change', filterCards);
            }
        });
    });

    var globalInput = document.querySelector('[data-global-search]');
    var globalForm = document.querySelector('[data-global-search-form]');
    var globalResults = document.querySelector('[data-search-results]');

    function renderSearchResults(query) {
        if (!globalResults || !window.SEARCH_INDEX) {
            return;
        }

        var q = String(query || '').toLowerCase().trim();
        globalResults.innerHTML = '';

        if (q.length < 1) {
            globalResults.classList.remove('is-open');
            return;
        }

        var matches = window.SEARCH_INDEX.filter(function(item) {
            return [item.title, item.year, item.region, item.type, item.genre, item.category].join(' ').toLowerCase().indexOf(q) !== -1;
        }).slice(0, 12);

        matches.forEach(function(item) {
            var link = document.createElement('a');
            var title = document.createElement('strong');
            var meta = document.createElement('span');
            link.href = item.url;
            title.textContent = item.title;
            meta.textContent = item.year + ' · ' + item.region + ' · ' + item.category;
            link.appendChild(title);
            link.appendChild(meta);
            globalResults.appendChild(link);
        });

        globalResults.classList.toggle('is-open', matches.length > 0);
    }

    if (globalInput) {
        globalInput.addEventListener('input', function() {
            renderSearchResults(globalInput.value);
        });
    }

    if (globalForm) {
        globalForm.addEventListener('submit', function(event) {
            event.preventDefault();
            renderSearchResults(globalInput ? globalInput.value : '');
        });
    }
})();
