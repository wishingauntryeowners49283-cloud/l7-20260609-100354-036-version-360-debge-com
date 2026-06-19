(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileMenu = document.querySelector("[data-mobile-menu]");
        if (menuButton && mobileMenu) {
            menuButton.addEventListener("click", function () {
                mobileMenu.classList.toggle("open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var current = 0;
            var showSlide = function (next) {
                current = next;
                slides.forEach(function (slide, index) {
                    slide.classList.toggle("active", index === current);
                });
                dots.forEach(function (dot, index) {
                    dot.classList.toggle("active", index === current);
                });
            };
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                });
            });
            if (slides.length > 1) {
                setInterval(function () {
                    showSlide((current + 1) % slides.length);
                }, 5200);
            }
        }

        var searchInput = document.getElementById("site-search");
        var regionSelect = document.getElementById("filter-region");
        var typeSelect = document.getElementById("filter-type");
        var yearSelect = document.getElementById("filter-year");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var applyFilters = function () {
            var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
            var region = regionSelect ? regionSelect.value : "";
            var type = typeSelect ? typeSelect.value : "";
            var year = yearSelect ? yearSelect.value : "";
            cards.forEach(function (card) {
                var haystack = [
                    card.dataset.title || "",
                    card.dataset.region || "",
                    card.dataset.type || "",
                    card.dataset.year || "",
                    card.dataset.genre || "",
                    card.dataset.category || ""
                ].join(" ").toLowerCase();
                var matched = true;
                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (region && card.dataset.region !== region) {
                    matched = false;
                }
                if (type && card.dataset.type !== type) {
                    matched = false;
                }
                if (year && card.dataset.year !== year) {
                    matched = false;
                }
                card.classList.toggle("is-hidden", !matched);
            });
        };
        [searchInput, regionSelect, typeSelect, yearSelect].forEach(function (item) {
            if (item) {
                item.addEventListener("input", applyFilters);
                item.addEventListener("change", applyFilters);
            }
        });

        var video = document.getElementById("movie-player");
        var trigger = document.getElementById("play-now");
        var stream = video ? video.dataset.stream : "";
        var loaded = false;
        var start = function () {
            if (!video || !stream) {
                return;
            }
            if (!loaded) {
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new Hls();
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
                loaded = true;
            }
            if (trigger) {
                trigger.classList.add("is-hidden");
            }
            var playTask = video.play();
            if (playTask && typeof playTask.catch === "function") {
                playTask.catch(function () {});
            }
        };
        if (trigger) {
            trigger.addEventListener("click", start);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
        }
    });
})();
