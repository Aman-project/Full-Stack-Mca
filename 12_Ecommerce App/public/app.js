let products = [];
let orders = [];
let cart = JSON.parse(localStorage.getItem('brutal_cart') || '[]');
let adminToken = sessionStorage.getItem('brutal_admin_token') || '';

// Shells
const storeShell = document.getElementById('store-shell');
const adminShell = document.getElementById('admin-shell');
const adminLoginScreen = document.getElementById('admin-login-screen');
const adminWorkspace = document.getElementById('admin-workspace');

// Storefront Navigation & Views
const navButtons = document.querySelectorAll('.nav-btn');
const logoBlock = document.querySelector('.logo-block');

const storeViews = {
  store: document.getElementById('view-store'),
  detail: document.getElementById('view-detail'),
  orders: document.getElementById('view-orders')
};

// Admin Navigation & Views
const adminTabButtons = document.querySelectorAll('.admin-tab-btn');
const adminViews = {
  studio: document.getElementById('admin-view-studio'),
  json: document.getElementById('admin-view-json')
};

const toastEl = document.getElementById('toast');
const storeGrid = document.getElementById('store-grid');
const storeSearch = document.getElementById('store-search');
const detailContainer = document.getElementById('detail-container');
const backToStoreBtn = document.getElementById('back-to-store-btn');
const ordersList = document.getElementById('orders-list');
const ordersCount = document.getElementById('orders-count');

// Admin Login & Studio DOM
const adminLoginForm = document.getElementById('admin-login-form');
const adminEmailInput = document.getElementById('admin-email');
const adminPasswordInput = document.getElementById('admin-password');
const loginErrorEl = document.getElementById('login-error');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

const sellerForm = document.getElementById('seller-form');
const sellerFormTitle = document.getElementById('seller-form-title');
const editProductId = document.getElementById('edit-product-id');
const prodName = document.getElementById('prod-name');
const prodPrice = document.getElementById('prod-price');
const prodStock = document.getElementById('prod-stock');
const prodCategory = document.getElementById('prod-category');
const prodImage = document.getElementById('prod-image');
const prodDesc = document.getElementById('prod-desc');
const sellerSubmitBtn = document.getElementById('seller-submit-btn');
const sellerCancelBtn = document.getElementById('seller-cancel-btn');
const sellerList = document.getElementById('seller-list');
const sellerCount = document.getElementById('seller-count');

// JSON Inspector DOM
const reloadJsonBtn = document.getElementById('reload-json-btn');
const metricsRow = document.getElementById('metrics-row');
const jsonProductsPre = document.getElementById('json-products-pre');
const jsonOrdersPre = document.getElementById('json-orders-pre');

// Cart & Payment DOM
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartDrawer = document.getElementById('cart-drawer');
const cartCount = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const checkoutBox = document.getElementById('checkout-box');
const cartTotalEl = document.getElementById('cart-total');
const paymentForm = document.getElementById('payment-form');
const payMethod = document.getElementById('pay-method');
const payDetailLabel = document.getElementById('pay-detail-label');
const payDetailInput = document.getElementById('pay-detail');

function formatINR(num) {
  return `₹${Number(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden');
  toastEl.style.animation = 'none';
  void toastEl.offsetWidth;
  toastEl.style.animation = '';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.add('hidden'), 3000);
}

function saveCart() {
  localStorage.setItem('brutal_cart', JSON.stringify(cart));
  renderCart();
}

function isAdminRoute() {
  return window.location.pathname.replace(/\/+$/, '') === '/admin';
}

// =========================================================
// ADMIN PORTAL ISOLATION & AUTH GATE
// =========================================================
async function bootAdminPortal() {
  storeShell.classList.add('hidden');
  adminShell.classList.remove('hidden');

  if (adminToken) {
    const check = await fetch('/api/admin/verify', {
      headers: { 'x-admin-token': adminToken }
    });
    if (check.ok) {
      await unlockAdminWorkspace();
      return;
    }
    adminToken = '';
    sessionStorage.removeItem('brutal_admin_token');
  }

  adminLoginScreen.classList.remove('hidden');
  adminWorkspace.classList.add('hidden');
}

async function unlockAdminWorkspace() {
  adminLoginScreen.classList.add('hidden');
  adminWorkspace.classList.remove('hidden');
  await fetchProducts();
  await switchAdminTab('studio');
}

adminLoginForm.addEventListener('submit', async e => {
  e.preventDefault();
  loginErrorEl.classList.add('hidden');

  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: adminEmailInput.value.trim(),
      password: adminPasswordInput.value
    })
  });

  const data = await res.json();
  if (!res.ok) {
    loginErrorEl.textContent = data.error || 'LOGIN FAILED';
    loginErrorEl.classList.remove('hidden');
    return;
  }

  adminToken = data.token;
  sessionStorage.setItem('brutal_admin_token', adminToken);
  adminLoginForm.reset();
  await unlockAdminWorkspace();
  showToast('ADMIN PORTAL UNLOCKED');
});

adminLogoutBtn.addEventListener('click', async () => {
  if (adminToken) {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: { 'x-admin-token': adminToken }
    });
  }
  adminToken = '';
  sessionStorage.removeItem('brutal_admin_token');
  resetSellerForm();
  adminWorkspace.classList.add('hidden');
  adminLoginScreen.classList.remove('hidden');
  showToast('LOGGED OUT OF ADMIN PORTAL');
});

async function switchAdminTab(tabName) {
  adminTabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.adminView === tabName));
  Object.entries(adminViews).forEach(([key, sec]) => {
    sec.classList.toggle('hidden', key !== tabName);
  });

  if (tabName === 'studio') {
    await fetchProducts();
  } else if (tabName === 'json') {
    await fetchStorageSnapshot();
  }
}

adminTabButtons.forEach(btn => {
  btn.addEventListener('click', () => switchAdminTab(btn.dataset.adminView));
});

// =========================================================
// CUSTOMER STOREFRONT NAVIGATION
// =========================================================
async function switchStoreView(viewName) {
  navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewName));
  Object.entries(storeViews).forEach(([key, sec]) => {
    sec.classList.toggle('hidden', key !== viewName);
  });

  if (viewName === 'store') {
    await fetchProducts();
  } else if (viewName === 'orders') {
    await fetchOrders();
  }
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => switchStoreView(btn.dataset.view));
});

logoBlock.addEventListener('click', () => switchStoreView('store'));
backToStoreBtn.addEventListener('click', () => switchStoreView('store'));

// =========================================================
// PRODUCTS & DETAIL VIEW
// =========================================================
async function fetchProducts() {
  const res = await fetch('/api/products');
  products = await res.json();
  renderStorefront();
  renderSellerList();
}

function renderStorefront() {
  const q = storeSearch.value.trim().toLowerCase();
  const filtered = products.filter(
    p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );

  storeGrid.innerHTML = '';

  if (!filtered.length) {
    storeGrid.innerHTML = '<div class="brutal-box">NO MATCHING PRODUCTS FOUND.</div>';
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const soldOut = product.stock <= 0;

    card.innerHTML = `
      <div class="product-media">
        <img class="product-img" src="${product.image}" alt="${product.name}" />
      </div>
      <div class="card-body">
        <div>
          <div class="tag-strip">
            <span class="neo-tag">${product.category}</span>
            <span class="stock-tag">${soldOut ? 'OUT OF STOCK' : `STOCK: ${product.stock}`}</span>
          </div>
          <h3 class="card-title">${product.name}</h3>
          <p class="card-desc">${product.description}</p>
        </div>
        <div class="card-foot">
          <span class="price-bold">${formatINR(product.price)}</span>
          <div class="card-btns">
            <button type="button" class="brutal-btn btn-white inspect-btn">SPECS</button>
            <button type="button" class="brutal-btn btn-yellow buy-btn" ${soldOut ? 'disabled' : ''}>
              ${soldOut ? 'SOLD OUT' : '+ CART'}
            </button>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.inspect-btn').addEventListener('click', () => openProductDetail(product.id));
    card.querySelector('.buy-btn').addEventListener('click', () => addToCart(product.id));
    storeGrid.appendChild(card);
  });
}

storeSearch.addEventListener('input', renderStorefront);

function openProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const soldOut = product.stock <= 0;

  detailContainer.innerHTML = `
    <img class="detail-img" src="${product.image}" alt="${product.name}" />
    <div class="detail-info">
      <div>
        <div class="tag-strip">
          <span class="neo-tag">${product.category}</span>
          <span class="stock-tag">ID #${product.id} // ${soldOut ? 'OUT OF STOCK' : `${product.stock} UNITS LEFT`}</span>
        </div>
        <h2 style="font-size:1.5rem;font-weight:900;margin-bottom:0.6rem;">${product.name}</h2>
        <p style="font-size:0.92rem;font-weight:600;margin-bottom:1rem;">${product.description}</p>
        <div style="font-size:1.35rem;font-weight:900;">${formatINR(product.price)}</div>
      </div>
      <div class="btn-row">
        <button type="button" id="detail-add-btn" class="brutal-btn btn-mint" ${soldOut ? 'disabled' : ''}>
          ${soldOut ? 'SOLD OUT' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  `;

  detailContainer.querySelector('#detail-add-btn')?.addEventListener('click', () => addToCart(product.id));

  navButtons.forEach(btn => btn.classList.remove('active'));
  Object.entries(storeViews).forEach(([key, sec]) => sec.classList.toggle('hidden', key !== 'detail'));
}

// =========================================================
// CART & PAYMENT CHECKOUT
// =========================================================
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stock <= 0) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    if (existing.qty >= product.stock) {
      showToast(`MAX STOCK REACHED (${product.stock})`);
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, qty: 1 });
  }

  saveCart();
  showToast(`ADDED: ${product.name}`);
}

function updateCartQty(productId, delta) {
  const idx = cart.findIndex(i => i.id === productId);
  if (idx === -1) return;

  const product = products.find(p => p.id === productId);
  const next = cart[idx].qty + delta;

  if (next <= 0) {
    cart.splice(idx, 1);
  } else if (product && next <= product.stock) {
    cart[idx].qty = next;
  }

  saveCart();
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  cartCount.textContent = count;
  cartItemsEl.innerHTML = '';

  if (!cart.length) {
    cartItemsEl.innerHTML = '<div class="brutal-box">CART IS EMPTY.</div>';
    checkoutBox.classList.add('hidden');
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const line = product.price * item.qty;
    total += line;

    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <div style="font-size:0.78rem;font-weight:700;">${formatINR(product.price)} x ${item.qty} = ${formatINR(line)}</div>
      </div>
      <div class="qty-box">
        <button type="button" class="qty-btn dec">-</button>
        <strong>${item.qty}</strong>
        <button type="button" class="qty-btn inc">+</button>
      </div>
    `;

    row.querySelector('.dec').addEventListener('click', () => updateCartQty(item.id, -1));
    row.querySelector('.inc').addEventListener('click', () => updateCartQty(item.id, 1));
    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = formatINR(total);
  checkoutBox.classList.remove('hidden');
}

function toggleDrawer(show) {
  cartDrawer.classList.toggle('hidden', !show);
  cartBackdrop.classList.toggle('hidden', !show);
}

openCartBtn.addEventListener('click', () => toggleDrawer(true));
closeCartBtn.addEventListener('click', () => toggleDrawer(false));
cartBackdrop.addEventListener('click', () => toggleDrawer(false));

payMethod.addEventListener('change', () => {
  if (payMethod.value === 'UPI') {
    payDetailLabel.textContent = 'UPI ID';
    payDetailInput.placeholder = 'username@upi';
  } else if (payMethod.value === 'Credit/Debit Card') {
    payDetailLabel.textContent = 'CARD NUMBER';
    payDetailInput.placeholder = '4242-XXXX-XXXX-4242';
  } else {
    payDetailLabel.textContent = 'BANK NAME';
    payDetailInput.placeholder = 'e.g., SBI / HDFC';
  }
});

paymentForm.addEventListener('submit', async e => {
  e.preventDefault();

  const payload = {
    customerName: document.getElementById('cust-name').value.trim(),
    customerEmail: document.getElementById('cust-email').value.trim(),
    paymentMethod: payMethod.value,
    paymentDetails: payDetailInput.value.trim(),
    items: cart
  };

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    showToast(data.error || 'PAYMENT FAILED');
    return;
  }

  cart = [];
  saveCart();
  paymentForm.reset();
  toggleDrawer(false);
  await fetchProducts();
  await fetchOrders();
  await switchStoreView('orders');
  showToast(`ORDER ${data.orderId} SAVED TO ORDERS.JSON`);
});

// =========================================================
// ORDERS PAGE
// =========================================================
async function fetchOrders() {
  const res = await fetch('/api/orders');
  orders = await res.json();
  ordersCount.textContent = orders.length;
  renderOrders();
}

function renderOrders() {
  ordersList.innerHTML = '';

  if (!orders.length) {
    ordersList.innerHTML = '<div class="brutal-box">NO ORDERS RECORDED YET.</div>';
    return;
  }

  orders.forEach(order => {
    const card = document.createElement('article');
    card.className = 'order-card';

    const rows = order.items
      .map(
        i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${formatINR(i.price)}</td><td><strong>${formatINR(i.lineTotal)}</strong></td></tr>`
      )
      .join('');

    card.innerHTML = `
      <div class="order-head">
        <div>
          <strong>${order.orderId}</strong> // ${order.customerName} (${order.customerEmail})
          <div style="font-size:0.78rem;font-weight:700;">${new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <span class="neo-tag" style="background:#00e5a0;">${order.status} [${order.paymentMethod}]</span>
      </div>
      <table class="order-table">
        <thead>
          <tr><th>ITEM</th><th>QTY</th><th>UNIT</th><th>SUBTOTAL</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="text-align:right;font-weight:900;font-size:1.02rem;">
        PAID: ${formatINR(order.totalAmount)}
      </div>
    `;

    ordersList.appendChild(card);
  });
}

// =========================================================
// SELLER STUDIO (PROTECTED CRUD)
// =========================================================
function resetSellerForm() {
  sellerForm.reset();
  editProductId.value = '';
  sellerFormTitle.textContent = 'ADD NEW PRODUCT';
  sellerSubmitBtn.textContent = 'SAVE TO JSON';
  sellerCancelBtn.classList.add('hidden');
}

function populateSellerEdit(product) {
  editProductId.value = product.id;
  prodName.value = product.name;
  prodPrice.value = product.price;
  prodStock.value = product.stock;
  prodCategory.value = product.category;
  prodImage.value = product.image;
  prodDesc.value = product.description;
  sellerFormTitle.textContent = `EDIT PRODUCT #${product.id}`;
  sellerSubmitBtn.textContent = 'UPDATE JSON';
  sellerCancelBtn.classList.remove('hidden');
  prodName.focus();
}

function renderSellerList() {
  sellerCount.textContent = products.length;
  sellerList.innerHTML = '';

  products.forEach(product => {
    const row = document.createElement('div');
    row.className = 'seller-item';
    row.innerHTML = `
      <div>
        <strong>#${product.id} — ${product.name}</strong>
        <div style="font-size:0.8rem;font-weight:700;">${product.category} // ${formatINR(product.price)} // STOCK: ${product.stock}</div>
      </div>
      <button type="button" class="brutal-btn btn-yellow edit-item-btn">EDIT</button>
    `;
    row.querySelector('.edit-item-btn').addEventListener('click', () => populateSellerEdit(product));
    sellerList.appendChild(row);
  });
}

sellerForm.addEventListener('submit', async e => {
  e.preventDefault();

  const payload = {
    name: prodName.value.trim(),
    price: Number(prodPrice.value),
    stock: Number(prodStock.value),
    category: prodCategory.value.trim(),
    image: prodImage.value.trim(),
    description: prodDesc.value.trim()
  };

  const id = editProductId.value;
  const url = id ? `/api/products/${id}` : '/api/products';
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': adminToken
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.status === 401) {
    adminToken = '';
    sessionStorage.removeItem('brutal_admin_token');
    await bootAdminPortal();
    showToast('SESSION EXPIRED — LOG IN AGAIN');
    return;
  }
  if (!res.ok) {
    showToast(data.error || 'SAVE FAILED');
    return;
  }

  resetSellerForm();
  await fetchProducts();
  showToast(id ? `UPDATED #${data.id} IN PRODUCTS.JSON` : `CREATED #${data.id} IN PRODUCTS.JSON`);
});

sellerCancelBtn.addEventListener('click', resetSellerForm);

// =========================================================
// ADMIN JSON STORAGE INSPECTOR
// =========================================================
async function fetchStorageSnapshot() {
  const res = await fetch('/api/storage-info', {
    headers: { 'x-admin-token': adminToken }
  });
  if (!res.ok) return;
  const info = await res.json();

  metricsRow.innerHTML = `
    <div class="metric-tile"><span>PRODUCTS IN JSON</span><strong>${info.stats.productCount}</strong></div>
    <div class="metric-tile"><span>TOTAL STOCK UNITS</span><strong>${info.stats.totalStockUnits}</strong></div>
    <div class="metric-tile"><span>ORDERS IN JSON</span><strong>${info.stats.orderCount}</strong></div>
    <div class="metric-tile"><span>TOTAL REVENUE</span><strong>${formatINR(info.stats.totalRevenue)}</strong></div>
  `;

  jsonProductsPre.textContent = JSON.stringify(info.productsPreview, null, 2);
  jsonOrdersPre.textContent = JSON.stringify(info.ordersPreview, null, 2);
}

reloadJsonBtn.addEventListener('click', fetchStorageSnapshot);

// =========================================================
// INITIALIZE APPLICATION BY ROUTE
// =========================================================
(async function init() {
  if (isAdminRoute()) {
    await bootAdminPortal();
  } else {
    storeShell.classList.remove('hidden');
    adminShell.classList.add('hidden');
    await fetchProducts();
    await fetchOrders();
    renderCart();
  }
})();