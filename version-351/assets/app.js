document.addEventListener("DOMContentLoaded", function () {
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var heroIndex = 0;

  function showHero(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, currentIndex) {
      slide.classList.toggle("active", currentIndex === heroIndex);
    });

    dots.forEach(function (dot, currentIndex) {
      dot.classList.toggle("active", currentIndex === heroIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showHero(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector("[data-filter-input]");
  var yearFilter = document.querySelector("[data-year-filter]");
  var typeFilter = document.querySelector("[data-type-filter]");
  var categoryFilter = document.querySelector("[data-category-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
  var params = new URLSearchParams(window.location.search);
  var queryValue = params.get("q") || "";

  if (filterInput && queryValue) {
    filterInput.value = queryValue;
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function matchCard(card) {
    var q = normalize(filterInput ? filterInput.value : "");
    var year = yearFilter ? yearFilter.value : "";
    var type = typeFilter ? typeFilter.value : "";
    var category = categoryFilter ? categoryFilter.value : "";
    var haystack = normalize(card.getAttribute("data-search"));
    var cardYear = card.getAttribute("data-year") || "";
    var cardType = card.getAttribute("data-type") || "";
    var cardCategory = card.getAttribute("data-category") || "";

    if (q && haystack.indexOf(q) === -1) {
      return false;
    }

    if (year && cardYear !== year) {
      return false;
    }

    if (type && cardType.indexOf(type) === -1) {
      return false;
    }

    if (category && cardCategory !== category) {
      return false;
    }

    return true;
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    cards.forEach(function (card) {
      card.hidden = !matchCard(card);
    });
  }

  [filterInput, yearFilter, typeFilter, categoryFilter].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    }
  });

  applyFilters();
});
