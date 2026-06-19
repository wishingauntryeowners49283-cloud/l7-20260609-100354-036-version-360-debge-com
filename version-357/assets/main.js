(function () {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  function setHeaderState() {
    if (!header) {
      return;
    }
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('is-missing');
    });
  });

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const next = hero.querySelector('[data-hero-next]');
    const prev = hero.querySelector('[data-hero-prev]');
    let current = 0;
    let timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.dataset.heroDot || 0));
        restart();
      });
    });

    show(0);
    restart();
  });

  document.querySelectorAll('[data-filter-form]').forEach(function (form) {
    const scope = form.closest('section')?.parentElement || document;
    const cards = Array.from(scope.querySelectorAll('.movie-card'));
    const searchInput = form.querySelector('[data-search-input]');
    const typeSelect = form.querySelector('[data-filter-select]');
    const yearInput = form.querySelector('[data-year-input]');
    const resetButton = form.querySelector('[data-reset-filter]');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      const query = normalize(searchInput ? searchInput.value : '');
      const selectedType = normalize(typeSelect ? typeSelect.value : '');
      const selectedYear = normalize(yearInput ? yearInput.value : '');

      cards.forEach(function (card) {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.genre,
          card.dataset.region,
          card.dataset.year,
          card.dataset.type,
          card.dataset.brief
        ].join(' '));
        const matchesQuery = !query || haystack.includes(query);
        const matchesType = !selectedType || normalize(card.dataset.type).includes(selectedType);
        const matchesYear = !selectedYear || normalize(card.dataset.year).includes(selectedYear);
        card.classList.toggle('is-hidden', !(matchesQuery && matchesType && matchesYear));
      });
    }

    [searchInput, typeSelect, yearInput].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
        }
        if (typeSelect) {
          typeSelect.value = '';
        }
        if (yearInput) {
          yearInput.value = '';
        }
        applyFilter();
      });
    }
  });
})();
