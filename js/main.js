/**
 * Refriaire Integral - Global JavaScript
 * Handles Navigation, Dropdowns, Shopping Cart Popup & Global UI
 */

// Shopping Cart State
let shoppingCart = [
  {
    id: 'prod-1',
    name: 'Aire acondicionado Dual Inverter Winner Plus 12000 BTU - 220V',
    price: 1836000,
    img: 'FOTOS-AIRES/RESIDENCIALES/thum-350x350(1).jpeg',
    qty: 1
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavbarDropdown();
  initMobileNavDrawer();
  initHeaderSearch();
  initShoppingCart();
});

// 1. Dropdown "Nosotros" Toggle & Accessibility
function initNavbarDropdown() {
  const dropdownContainers = document.querySelectorAll('.nav-dropdown');

  dropdownContainers.forEach(container => {
    const btn = container.querySelector('.nav-dropdown-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = container.classList.contains('is-open');
      
      dropdownContainers.forEach(d => d.classList.remove('is-open'));
      
      if (!isOpen) {
        container.classList.add('is-open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    dropdownContainers.forEach(container => {
      if (!container.contains(e.target)) {
        container.classList.remove('is-open');
      }
    });
  });
}

// 2. Mobile Navigation Drawer
function initMobileNavDrawer() {
  const openBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const drawer = document.getElementById('mobileNavDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');

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

  const accordions = document.querySelectorAll('.mobile-accordion-btn');
  accordions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.mobile-accordion');
      if (parent) {
        parent.classList.toggle('is-open');
      }
    });
  });
}

// 3. Header Search Form
function initHeaderSearch() {
  const searchForms = document.querySelectorAll('.search-form');
  
  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.search-input');
      if (input && input.value.trim() !== '') {
        window.location.href = `tienda.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
  });
}

// 4. Shopping Cart Interactive Logic & Popup
function initShoppingCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartDropdown = document.getElementById('cartDropdown');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsContainer = document.getElementById('cartDropdownItems');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Format currency helper
  function formatMoney(amount) {
    return '$' + amount.toLocaleString('es-CO');
  }

  // Render Cart UI
  function renderCart() {
    const totalCount = shoppingCart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.classList.add('bounce');
      setTimeout(() => cartBadge.classList.remove('bounce'), 300);
    }

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = formatMoney(subtotal);
    }

    if (!cartItemsContainer) return;

    if (shoppingCart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <p>Tu carrito está vacío</p>
          <a href="tienda.html" class="btn btn-outline-primary btn-sm" style="margin-top: 0.75rem;">Explorar Tienda</a>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = shoppingCart.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.img}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <h4 class="cart-item-name" title="${item.name}">${item.name}</h4>
          <span class="cart-item-price">${formatMoney(item.price)}</span>
          <div class="cart-item-qty-controls">
            <button type="button" class="cart-qty-btn btn-qty-minus" aria-label="Disminuir">-</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button type="button" class="cart-qty-btn btn-qty-plus" aria-label="Aumentar">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-remove" aria-label="Eliminar producto">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `).join('');

    // Attach row events
    cartItemsContainer.querySelectorAll('.cart-item-row').forEach(row => {
      const id = row.dataset.id;
      
      row.querySelector('.btn-qty-minus').addEventListener('click', () => {
        const item = shoppingCart.find(p => p.id === id);
        if (item) {
          if (item.qty > 1) {
            item.qty--;
          } else {
            shoppingCart = shoppingCart.filter(p => p.id !== id);
          }
          renderCart();
        }
      });

      row.querySelector('.btn-qty-plus').addEventListener('click', () => {
        const item = shoppingCart.find(p => p.id === id);
        if (item) {
          item.qty++;
          renderCart();
        }
      });

      row.querySelector('.cart-item-remove').addEventListener('click', () => {
        shoppingCart = shoppingCart.filter(p => p.id !== id);
        renderCart();
      });
    });
  }

  // Toggle Cart Dropdown
  if (cartBtn && cartDropdown) {
    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartDropdown.classList.toggle('is-open');
    });

    if (cartCloseBtn) {
      cartCloseBtn.addEventListener('click', () => {
        cartDropdown.classList.remove('is-open');
      });
    }

    document.addEventListener('click', (e) => {
      if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
        cartDropdown.classList.remove('is-open');
      }
    });
  }

  // Global Add-To-Cart listener on "Comprar" buttons
  document.addEventListener('click', (e) => {
    const buyBtn = e.target.closest('.btn-buy');
    if (!buyBtn) return;

    e.preventDefault();
    const card = buyBtn.closest('.product-card');
    if (!card) return;

    const titleEl = card.querySelector('.product-card-title');
    const priceEl = card.querySelector('.product-card-price');
    const imgEl = card.querySelector('.product-card-img');

    const name = titleEl ? titleEl.textContent.trim() : 'Aire acondicionado';
    const rawPrice = priceEl ? priceEl.textContent.replace(/[^0-9]/g, '') : '1836000';
    const price = parseInt(rawPrice, 10) || 1800000;
    const img = imgEl ? imgEl.getAttribute('src') : 'FOTOS-AIRES/RESIDENCIALES/thum-350x350(1).jpeg';
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);

    const existing = shoppingCart.find(item => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      shoppingCart.push({ id, name, price, img, qty: 1 });
    }

    renderCart();
    showToast(`✓ "${name.substring(0, 35)}..." agregado al carrito`);

    // Optionally open cart dropdown
    if (cartDropdown) {
      cartDropdown.classList.add('is-open');
    }
  });

  // Checkout Button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (shoppingCart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos para continuar.');
      } else {
        alert('¡Continuando al checkout de Refriaire Integral! (Paso de pago prototipo)');
      }
    });
  }

  // Initial render
  renderCart();
}

// Global Toast Message
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
