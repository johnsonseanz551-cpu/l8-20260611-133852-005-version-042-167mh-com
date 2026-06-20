document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.querySelector('[data-mobile-menu-button]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    let activeIndex = 0;

    const activateSlide = function (index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activateSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        activateSlide(activeIndex + 1);
      }, 5200);
    }
  }

  const getSearchText = function (item) {
    return (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
  };

  const applyFilter = function (input) {
    const value = input.value.trim().toLowerCase();
    const scope = input.closest('main') || document;
    const items = Array.from(scope.querySelectorAll('[data-search]'));
    let visibleCount = 0;

    items.forEach(function (item) {
      const matched = !value || getSearchText(item).includes(value);
      item.style.display = matched ? '' : 'none';
      if (matched) {
        visibleCount += 1;
      }
    });

    const emptyState = scope.querySelector('[data-empty-state]');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  const query = new URLSearchParams(window.location.search).get('q') || '';
  document.querySelectorAll('.filter-input').forEach(function (input) {
    if (input.hasAttribute('data-query-input') && query) {
      input.value = query;
    }
    input.addEventListener('input', function () {
      applyFilter(input);
    });
    applyFilter(input);
  });

  document.querySelectorAll('[data-sort]').forEach(function (button) {
    button.addEventListener('click', function () {
      const type = button.getAttribute('data-sort');
      const section = button.closest('main') || document;
      const grid = section.querySelector('.movie-grid');
      if (!grid) {
        return;
      }

      const cards = Array.from(grid.querySelectorAll('.movie-card'));
      cards.sort(function (a, b) {
        if (type === 'heat') {
          return Number(b.dataset.heat || 0) - Number(a.dataset.heat || 0);
        }
        if (type === 'score') {
          return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
        }
        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
      });

      cards.forEach(function (card) {
        grid.appendChild(card);
      });

      section.querySelectorAll('[data-sort]').forEach(function (sortButton) {
        sortButton.classList.toggle('is-active', sortButton === button);
      });
    });
  });
});
