(function() {
    function setupMobileMenu() {
        var button = document.querySelector('[data-mobile-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function() {
            panel.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        var next = root.querySelector('[data-hero-next]');
        var prev = root.querySelector('[data-hero-prev]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function() {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (next) {
            next.addEventListener('click', function() {
                show(current + 1);
                start();
            });
        }

        if (prev) {
            prev.addEventListener('click', function() {
                show(current - 1);
                start();
            });
        }

        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupInlineFilters() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
        inputs.forEach(function(input) {
            var grid = document.querySelector('[data-filter-grid]');
            if (!grid) {
                return;
            }
            var items = Array.prototype.slice.call(grid.querySelectorAll('.filter-item'));
            input.addEventListener('input', function() {
                var query = input.value.trim().toLowerCase();
                items.forEach(function(item) {
                    var text = (item.getAttribute('data-filter-text') || item.textContent || '').toLowerCase();
                    item.classList.toggle('is-hidden', query && text.indexOf(query) === -1);
                });
            });
        });
    }

    function movieCard(movie) {
        return [
            '<a class="movie-card movie-card--small" href="' + movie.url + '">',
            '    <span class="movie-card__image">',
            '        <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="movie-card__shade"></span>',
            '        <span class="movie-card__play">▶</span>',
            '        <span class="movie-card__tag">' + escapeHtml(movie.primaryGenre) + '</span>',
            '    </span>',
            '    <span class="movie-card__body">',
            '        <strong>' + escapeHtml(movie.title) + '</strong>',
            '        <span>' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + '</span>',
            '        <em>' + escapeHtml(movie.oneLine) + '</em>',
            '    </span>',
            '</a>'
        ].join('\n');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function setupSearchPage() {
        var input = document.getElementById('siteSearchInput');
        var results = document.getElementById('searchResults');
        var status = document.getElementById('searchStatus');
        if (!input || !results || !status || !window.SEARCH_MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        input.value = initial;

        function render() {
            var query = input.value.trim().toLowerCase();
            var pool = window.SEARCH_MOVIES.filter(function(movie) {
                if (!query) {
                    return true;
                }
                var text = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.category, movie.oneLine].join(' ').toLowerCase();
                return text.indexOf(query) !== -1;
            }).slice(0, 120);
            status.textContent = query ? '搜索结果' : '热门内容';
            results.innerHTML = pool.map(movieCard).join('\n');
        }

        input.addEventListener('input', render);
        render();
    }

    document.addEventListener('DOMContentLoaded', function() {
        setupMobileMenu();
        setupHero();
        setupInlineFilters();
        setupSearchPage();
    });
})();
