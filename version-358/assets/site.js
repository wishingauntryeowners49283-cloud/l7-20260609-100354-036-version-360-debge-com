(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("open");
      });
    }

    var carousel = document.querySelector("[data-hero-carousel]");

    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      var prev = carousel.querySelector("[data-hero-prev]");
      var next = carousel.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === current);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          restart();
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          restart();
        });
      });

      show(0);
      restart();
    }

    var searchInput = document.querySelector("[data-search-input]");
    var searchButton = document.querySelector("[data-search-submit]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));

    function applySearch() {
      if (!searchInput || !cards.length) {
        return;
      }

      var query = searchInput.value.trim().toLowerCase();
      var activeFilter = document.querySelector("[data-filter].active");
      var filter = activeFilter ? activeFilter.getAttribute("data-filter") : "";

      cards.forEach(function (card) {
        var text = card.getAttribute("data-search-text") || "";
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchFilter = !filter || filter === "all" || text.indexOf(filter.toLowerCase()) !== -1;
        card.classList.toggle("hidden-card", !(matchQuery && matchFilter));
      });
    }

    if (searchInput && cards.length) {
      var params = new URLSearchParams(window.location.search);
      var queryValue = params.get("q");

      if (queryValue) {
        searchInput.value = queryValue;
      }

      searchInput.addEventListener("input", applySearch);
      applySearch();
    }

    if (searchButton && searchInput && !cards.length) {
      searchButton.addEventListener("click", function () {
        var query = searchInput.value.trim();
        var target = "search.html";
        if (query) {
          target += "?q=" + encodeURIComponent(query);
        }
        window.location.href = target;
      });

      searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          searchButton.click();
        }
      });
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        filterButtons.forEach(function (item) {
          item.classList.remove("active");
        });
        button.classList.add("active");
        applySearch();
      });
    });
  });
})();
