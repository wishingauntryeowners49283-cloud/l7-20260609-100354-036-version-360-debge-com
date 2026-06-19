(function () {
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMobileMenu() {
        var button = $('.mobile-menu-button');
        var menu = $('.mobile-nav');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            var open = menu.classList.toggle('open');
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
            button.textContent = open ? '×' : '☰';
        });
    }

    function setupHero() {
        var root = $('[data-carousel]');
        if (!root) {
            return;
        }
        var slides = $all('.hero-slide', root);
        var dots = $all('.hero-dot', root);
        var index = 0;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide')) || 0);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
    }

    function setupSearchForms() {
        $all('[data-search-form]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"], input[type="search"]');
                var value = input ? input.value.trim() : '';
                window.location.href = './search.html' + (value ? '?q=' + encodeURIComponent(value) : '');
            });
        });
    }

    function normalize(value) {
        return (value || '').toString().toLowerCase().replace(/\s+/g, '');
    }

    function setupLocalFiltering() {
        var grid = $('[data-card-grid]');
        if (!grid) {
            return;
        }
        var cards = $all('.movie-card', grid);
        var input = $('[data-local-search] input[type="search"]');
        var buttons = $all('[data-filter-bar] .filter-button');
        var empty = $('.empty-state');
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        var activeFilter = 'all';
        if (input && initial) {
            input.value = initial;
        }
        function apply() {
            var query = normalize(input ? input.value : '');
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' '));
                var category = card.getAttribute('data-category') || '';
                var type = card.getAttribute('data-type') || '';
                var year = card.getAttribute('data-year') || '';
                var region = card.getAttribute('data-region') || '';
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchFilter = activeFilter === 'all' || category === activeFilter || type === activeFilter || year === activeFilter || region.indexOf(activeFilter) !== -1 || haystack.indexOf(normalize(activeFilter)) !== -1;
                var show = matchQuery && matchFilter;
                card.classList.toggle('hidden-card', !show);
                if (show) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }
        if (input) {
            input.addEventListener('input', apply);
            var form = input.closest('form');
            if (form) {
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    apply();
                });
            }
        }
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeFilter = button.getAttribute('data-filter') || 'all';
                buttons.forEach(function (item) {
                    item.classList.toggle('active', item === button);
                });
                apply();
            });
        });
        apply();
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileMenu();
        setupHero();
        setupSearchForms();
        setupLocalFiltering();
    });
})();
