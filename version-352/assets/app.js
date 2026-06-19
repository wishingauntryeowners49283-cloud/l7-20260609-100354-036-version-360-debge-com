(() => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    const mobileButton = $('.menu-toggle');
    const mobileNav = $('.mobile-nav');
    if (mobileButton && mobileNav) {
        mobileButton.addEventListener('click', () => {
            const open = mobileNav.classList.toggle('is-open');
            mobileButton.setAttribute('aria-expanded', String(open));
            mobileButton.textContent = open ? '×' : '☰';
        });
    }

    const slides = $$('.hero-slide');
    const dots = $$('.hero-dot');
    if (slides.length > 1) {
        let current = 0;
        const show = (index) => {
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
        };
        dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
        window.setInterval(() => show(current + 1), 5200);
    }

    const normalize = (value) => String(value || '').trim().toLowerCase();
    const filterCards = (root, query, chip) => {
        const q = normalize(query);
        const c = normalize(chip === 'all' ? '' : chip);
        $$('.movie-card, .compact-card', root).forEach((card) => {
            const text = normalize([
                card.dataset.title,
                card.dataset.region,
                card.dataset.year,
                card.dataset.genre,
                card.dataset.tags,
                card.dataset.category,
                card.textContent
            ].join(' '));
            const okText = !q || text.includes(q);
            const okChip = !c || text.includes(c);
            card.classList.toggle('hidden-card', !(okText && okChip));
        });
    };

    $$('.filter-bar').forEach((bar) => {
        const list = bar.parentElement ? $('.filter-list', bar.parentElement) : null;
        if (!list) return;
        const input = $('.local-filter, .global-filter', bar);
        const buttons = $$('[data-filter]', bar);
        let active = 'all';
        const run = () => filterCards(list, input ? input.value : '', active);
        if (input) input.addEventListener('input', run);
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                active = button.dataset.filter || 'all';
                buttons.forEach((item) => item.classList.toggle('active', item === button));
                run();
            });
        });
    });

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        $$('.global-filter').forEach((input) => {
            input.value = q;
            const bar = input.closest('.filter-bar');
            const list = bar && bar.parentElement ? $('.filter-list', bar.parentElement) : null;
            if (list) filterCards(list, q, 'all');
        });
        $$('.hero-search input[name="q"]').forEach((input) => {
            input.value = q;
        });
    }

    $$('.movie-player').forEach((player) => {
        const video = $('video', player);
        const trigger = $('.player-poster', player);
        if (!video || !trigger) return;
        let attached = false;
        let hls;
        const attach = () => {
            if (attached) return;
            const stream = video.getAttribute('data-stream');
            if (!stream) return;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
            attached = true;
        };
        const start = () => {
            attach();
            player.classList.add('is-playing');
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
            }
        };
        trigger.addEventListener('click', start);
        player.addEventListener('click', (event) => {
            if (event.target === video && !attached) start();
        });
        video.addEventListener('play', () => player.classList.add('is-playing'));
        window.addEventListener('beforeunload', () => {
            if (hls && typeof hls.destroy === 'function') hls.destroy();
        });
    });

    $$('[data-scroll-player]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const player = $('.movie-player');
            if (player) {
                player.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const button = $('.player-poster', player);
                if (button) button.click();
            }
        });
    });
})();
