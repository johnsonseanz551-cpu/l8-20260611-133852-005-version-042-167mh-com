(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-missing');
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dotsWrap = hero.querySelector('[data-hero-dots]');
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll('button')) : [];
    var active = 0;

    function setHero(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setHero(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        setHero(active + 1);
      }, 5200);
    }
  }

  var lists = Array.prototype.slice.call(document.querySelectorAll('[data-card-list]'));
  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function cardMatches(card, keyword, mode) {
    var text = normalize([
      card.dataset.title,
      card.dataset.year,
      card.dataset.type,
      card.dataset.region,
      card.dataset.tags,
      card.textContent
    ].join(' '));
    var type = normalize(card.dataset.type);
    var year = Number(card.dataset.year || 0);
    var keywordPass = !keyword || text.indexOf(keyword) !== -1;
    var modePass = true;

    if (mode === 'movie') {
      modePass = type.indexOf('电影') !== -1 || type.indexOf('片') !== -1;
    }

    if (mode === 'series') {
      modePass = type.indexOf('剧') !== -1 || type.indexOf('综艺') !== -1;
    }

    if (mode === 'recent') {
      modePass = year >= 2020;
    }

    return keywordPass && modePass;
  }

  function applyFilters() {
    var keyword = normalize(searchInputs.map(function (input) {
      return input.value;
    }).filter(Boolean).join(' '));
    var activeButton = document.querySelector('[data-filter-button].is-active');
    var mode = activeButton ? activeButton.dataset.filterButton : 'all';

    lists.forEach(function (list) {
      var visible = 0;
      var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));

      cards.forEach(function (card) {
        var matched = cardMatches(card, keyword, mode);
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      var empty = list.parentElement.querySelector('[data-empty-state]');
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', applyFilters);
  });

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      applyFilters();
    });
  });

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilters();
      var target = document.querySelector('[data-card-list]');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}());
