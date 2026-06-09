(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
            document.body.classList.toggle("menu-open", menu.classList.contains("is-open"));
        });
    }

    function setupHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dots button"));
        var index = 0;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("is-active", itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle("is-active", itemIndex === index);
            });
        }
        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener("click", function () {
                show(itemIndex);
            });
        });
        if (slides.length > 1) {
            setInterval(function () {
                show(index + 1);
            }, 5600);
        }
    }

    function buildSearchItem(movie) {
        var link = document.createElement("a");
        link.href = movie.url;
        var image = document.createElement("img");
        image.src = movie.image;
        image.alt = movie.title + " 在线观看";
        image.loading = "lazy";
        var body = document.createElement("span");
        var title = document.createElement("strong");
        title.textContent = movie.title;
        var meta = document.createElement("small");
        meta.textContent = movie.year + " · " + movie.genre;
        body.appendChild(title);
        body.appendChild(meta);
        link.appendChild(image);
        link.appendChild(body);
        return link;
    }

    function setupGlobalSearch() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-global-search]"));
        if (!forms.length || typeof MOVIE_INDEX === "undefined") {
            return;
        }
        forms.forEach(function (form) {
            var input = form.querySelector("input");
            var results = form.querySelector("[data-search-results]");
            if (!input || !results) {
                return;
            }
            function render() {
                var query = normalize(input.value);
                results.innerHTML = "";
                if (!query) {
                    results.classList.remove("is-open");
                    return;
                }
                var found = MOVIE_INDEX.filter(function (movie) {
                    return normalize(movie.title + " " + movie.genre + " " + movie.year + " " + movie.region).indexOf(query) !== -1;
                }).slice(0, 10);
                if (!found.length) {
                    var empty = document.createElement("div");
                    empty.className = "search-empty";
                    empty.textContent = "没有找到匹配内容";
                    empty.style.padding = "12px";
                    results.appendChild(empty);
                } else {
                    found.forEach(function (movie) {
                        results.appendChild(buildSearchItem(movie));
                    });
                }
                results.classList.add("is-open");
            }
            input.addEventListener("input", render);
            input.addEventListener("focus", render);
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var first = results.querySelector("a");
                if (first) {
                    window.location.href = first.href;
                }
            });
            document.addEventListener("click", function (event) {
                if (!form.contains(event.target)) {
                    results.classList.remove("is-open");
                }
            });
        });
    }

    function setupFilters() {
        var input = document.querySelector("[data-filter-input]");
        var select = document.querySelector("[data-filter-select]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .ranking-item"));
        if (!cards.length || (!input && !select)) {
            return;
        }
        function apply() {
            var query = input ? normalize(input.value) : "";
            var year = select ? String(select.value || "") : "";
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year")
                ].join(" "));
                var matchesQuery = !query || haystack.indexOf(query) !== -1;
                var matchesYear = !year || card.getAttribute("data-year") === year;
                card.classList.toggle("is-hidden-by-filter", !(matchesQuery && matchesYear));
            });
        }
        if (input) {
            input.addEventListener("input", apply);
        }
        if (select) {
            select.addEventListener("change", apply);
        }
    }

    window.initMoviePlayer = function (streamUrl) {
        var video = document.getElementById("moviePlayer");
        var button = document.getElementById("playButton");
        if (!video || !button || !streamUrl) {
            return;
        }
        var attached = false;
        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }
        function play() {
            attach();
            button.classList.add("is-hidden");
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }
        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
        video.addEventListener("pause", function () {
            if (!video.ended) {
                button.classList.remove("is-hidden");
            }
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupGlobalSearch();
        setupFilters();
    });
})();
