/**
 * Refriaire Integral - Tienda Page JavaScript (v2 Grid & Filter Logic)
 * Handles LG-Style Filters, Accordions, Active Filter Chips, Sorting & Mobile Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  initFilterAccordions();
  initFilterLogic();
  initMobileFilterDrawer();
  initSorting();
});

// 1. Collapsible Filter Accordions
function initFilterAccordions() {
  const headers = document.querySelectorAll('.filter-group-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const group = header.closest('.filter-group');
      if (group) {
        group.classList.toggle('is-collapsed');
      }
    });
  });
}

// 2. Interactive Filtering Logic for Grid Layout
function initFilterLogic() {
  const checkboxes = document.querySelectorAll('.filter-checkbox-input');
  const clearBtns = document.querySelectorAll('.btn-clear-filters');
  const activeChipsContainer = document.getElementById('activeFiltersBar');
  const resultsCountEl = document.getElementById('resultsCount');
  const productCards = document.querySelectorAll('.product-grid .product-card');

  if (checkboxes.length === 0) return;

  function updateFilters() {
    const selectedFilters = {};

    checkboxes.forEach(cb => {
      if (cb.checked) {
        const filterType = cb.dataset.filterType;
        const filterVal = cb.dataset.filterValue;
        if (!selectedFilters[filterType]) {
          selectedFilters[filterType] = [];
        }
        selectedFilters[filterType].push(filterVal);
      }
    });

    renderActiveChips(selectedFilters);

    let visibleCount = 0;
    productCards.forEach(card => {
      let matches = true;

      for (const [type, values] of Object.entries(selectedFilters)) {
        const cardVal = card.dataset[type];
        if (values.length > 0 && !values.includes(cardVal)) {
          matches = false;
          break;
        }
      }

      if (matches) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCountEl) {
      resultsCountEl.innerHTML = `Mostrando <strong>${visibleCount}</strong> productos`;
    }
  }

  function renderActiveChips(selectedFilters) {
    if (!activeChipsContainer) return;
    activeChipsContainer.innerHTML = '';

    let hasActive = false;

    for (const [type, values] of Object.entries(selectedFilters)) {
      values.forEach(val => {
        hasActive = true;
        const chip = document.createElement('div');
        chip.className = 'active-filter-chip';
        chip.innerHTML = `
          <span>${val}</span>
          <button type="button" aria-label="Remover filtro" data-type="${type}" data-val="${val}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        `;

        chip.querySelector('button').addEventListener('click', () => {
          const targetCb = document.querySelectorAll(`.filter-checkbox-input[data-filter-type="${type}"][data-filter-value="${val}"]`);
          targetCb.forEach(cb => cb.checked = false);
          updateFilters();
        });

        activeChipsContainer.appendChild(chip);
      });
    }

    activeChipsContainer.style.display = hasActive ? 'flex' : 'none';
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateFilters);
  });

  clearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      checkboxes.forEach(cb => cb.checked = false);
      updateFilters();
    });
  });
}

// 3. Mobile Filter Drawer
function initMobileFilterDrawer() {
  const openBtn = document.getElementById('openMobileFilters');
  const closeBtn = document.getElementById('closeMobileFilters');
  const applyBtn = document.getElementById('applyMobileFilters');
  const drawer = document.getElementById('mobileFilterDrawer');
  const overlay = document.getElementById('mobileFilterOverlay');

  if (!openBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  if (applyBtn) applyBtn.addEventListener('click', closeDrawer);
}

// 4. Sorting Functionality
function initSorting() {
  const sortSelect = document.getElementById('sortProducts');
  const gridContainer = document.querySelector('.product-grid');
  if (!sortSelect || !gridContainer) return;

  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    const cards = Array.from(gridContainer.querySelectorAll('.product-card'));

    cards.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price || '0');
      const priceB = parseFloat(b.dataset.price || '0');

      if (val === 'price-asc') {
        return priceA - priceB;
      } else if (val === 'price-desc') {
        return priceB - priceA;
      }
      return 0;
    });

    cards.forEach(card => gridContainer.appendChild(card));
  });
}
