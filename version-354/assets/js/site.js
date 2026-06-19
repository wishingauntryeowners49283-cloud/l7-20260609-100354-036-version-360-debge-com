(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('is-missing');
      image.setAttribute('aria-hidden', 'true');
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

    function startHero() {
      if (timer || slides.length <= 1) {
        return;
      }
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        clearInterval(timer);
        timer = null;
        startHero();
      });
    });

    startHero();
  }

  var scope = document.querySelector('[data-filter-scope]');
  var input = document.querySelector('[data-filter-input]');
  var yearSelect = document.querySelector('[data-year-filter]');
  var typeSelect = document.querySelector('[data-type-filter]');
  var emptyState = document.querySelector('[data-empty-state]');

  if (scope) {
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var query = new URLSearchParams(window.location.search).get('q') || '';

    if (input && query) {
      input.value = query;
    }

    function applyFilters() {
      var text = input ? input.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = ((card.dataset.title || '') + ' ' + (card.dataset.meta || '')).toLowerCase();
        var cardYear = card.dataset.year || '';
        var cardType = card.dataset.type || '';
        var matched = (!text || haystack.indexOf(text) !== -1) && (!year || cardYear === year) && (!type || cardType.indexOf(type) !== -1);
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    [input, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }

  var video = document.querySelector('[data-stream]');

  if (video) {
    var stream = video.dataset.stream;
    var controls = Array.prototype.slice.call(document.querySelectorAll('[data-play-control]'));
    var overlay = document.querySelector('.player-overlay');
    var hasPrepared = false;
    var hlsInstance = null;

    function prepareVideo() {
      if (hasPrepared || !stream) {
        return;
      }
      hasPrepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }

      video.addEventListener('ended', function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }

    function playVideo() {
      prepareVideo();
      video.controls = true;
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    controls.forEach(function (control) {
      control.addEventListener('click', playVideo);
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
