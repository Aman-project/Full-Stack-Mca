const productForm = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const ratingInput = document.getElementById('rating');
const submitBtn = document.getElementById('submit-btn');
const refreshBtn = document.getElementById('refresh-btn');
const productList = document.getElementById('product-list');
const productCount = document.getElementById('product-count');
const feedbackMsg = document.getElementById('feedback-msg');

const API_URL = '/api/products';

function showFeedback(message, type) {
  feedbackMsg.textContent = message;
  feedbackMsg.className = `feedback-msg ${type}`;
}

function clearFeedback() {
  feedbackMsg.textContent = '';
  feedbackMsg.className = 'feedback-msg hidden';
}

function formatPrice(value) {
  return `₹${Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// Render all products dynamically in the browser DOM
function renderProducts(products) {
  productCount.textContent = `${products.length} ${products.length === 1 ? 'product' : 'products'}`;
  productList.innerHTML = '';

  if (products.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-msg';
    empty.textContent = 'No products available yet. Add one using the form above.';
    productList.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const top = document.createElement('div');
    top.className = 'product-top';

    const idSpan = document.createElement('span');
    idSpan.className = 'product-id';
    idSpan.textContent = `#${product.id}`;

    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'rating-badge';
    ratingSpan.textContent = `★ ${Number(product.rating).toFixed(1)} / 5`;

    top.append(idSpan, ratingSpan);

    const nameHeading = document.createElement('h3');
    nameHeading.className = 'product-name';
    nameHeading.textContent = product.name;

    const pricePara = document.createElement('p');
    pricePara.className = 'product-price';
    pricePara.textContent = formatPrice(product.price);

    card.append(top, nameHeading, pricePara);
    fragment.appendChild(card);
  });

  productList.appendChild(fragment);
}

// GET /api/products and render on the client
async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch products (${res.status})`);
    }
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    productList.innerHTML = '';
    const errPara = document.createElement('p');
    errPara.className = 'empty-msg';
    errPara.textContent = 'Could not load products from the server.';
    productList.appendChild(errPara);
  }
}

// POST /api/products when form is submitted
productForm.addEventListener('submit', async e => {
  e.preventDefault();
  clearFeedback();

  const payload = {
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
    rating: Number(ratingInput.value)
  };

  submitBtn.disabled = true;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await res.json();

    if (!res.ok) {
      showFeedback(body.error || 'Could not add product.', 'error');
      return;
    }

    productForm.reset();
    showFeedback(`Added "${body.name}" (ID #${body.id}).`, 'success');
    await fetchProducts();
  } catch {
    showFeedback('Network error while saving product.', 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

refreshBtn.addEventListener('click', fetchProducts);

// Initial client-side load
fetchProducts();