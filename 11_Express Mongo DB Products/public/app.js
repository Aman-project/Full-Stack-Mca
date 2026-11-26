const API = '/api/products';

const form = document.getElementById('product-form');
const formHeading = document.getElementById('form-heading');
const idInput = document.getElementById('product-id');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const ratingInput = document.getElementById('rating');
const descInput = document.getElementById('description');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const statusEl = document.getElementById('status-message');
const listEl = document.getElementById('product-list');
const countEl = document.getElementById('item-count');

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.className = `status-message ${isError ? 'err' : 'ok'}`;
}

function resetForm() {
  form.reset();
  idInput.value = '';
  formHeading.textContent = 'Create Product';
  saveBtn.textContent = 'Save Product';
  cancelBtn.classList.add('hidden');
}

function startEdit(product) {
  idInput.value = product._id;
  nameInput.value = product.name;
  priceInput.value = product.price;
  ratingInput.value = product.rating;
  descInput.value = product.description;
  formHeading.textContent = 'Update Product';
  saveBtn.textContent = 'Update Product';
  cancelBtn.classList.remove('hidden');
  nameInput.focus();
}

function formatINR(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function renderList(products) {
  countEl.textContent = `${products.length} ${products.length === 1 ? 'item' : 'items'}`;
  listEl.innerHTML = '';

  if (!products.length) {
    const p = document.createElement('p');
    p.className = 'empty-note';
    p.textContent = 'No products in MongoDB yet. Add one using the form.';
    listEl.appendChild(p);
    return;
  }

  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const item = document.createElement('article');
    item.className = 'product-item';

    const top = document.createElement('div');
    top.className = 'product-top';

    const title = document.createElement('h3');
    title.className = 'product-name';
    title.textContent = product.name;

    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = formatINR(product.price);

    top.append(title, price);

    const rating = document.createElement('span');
    rating.className = 'product-rating';
    rating.textContent = `★ ${Number(product.rating).toFixed(1)} / 5`;

    const desc = document.createElement('p');
    desc.className = 'product-desc';
    desc.textContent = product.description;

    const actions = document.createElement('div');
    actions.className = 'product-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn btn-sage';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(product));

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-danger';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteProduct(product._id));

    actions.append(editBtn, delBtn);
    item.append(top, rating, desc, actions);
    fragment.appendChild(item);
  });

  listEl.appendChild(fragment);
}

async function loadProducts() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load products');
    renderList(data);
  } catch (err) {
    setStatus(err.message, true);
  }
}

async function deleteProduct(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    if (idInput.value === id) resetForm();
    setStatus('Product removed from MongoDB.');
    await loadProducts();
  } catch (err) {
    setStatus(err.message, true);
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
    rating: Number(ratingInput.value),
    description: descInput.value.trim()
  };

  const editingId = idInput.value;
  const url = editingId ? `${API}/${editingId}` : API;
  const method = editingId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error || 'Could not save product.', true);
      return;
    }

    resetForm();
    setStatus(editingId ? 'Product updated in MongoDB.' : 'Product saved to MongoDB.');
    await loadProducts();
  } catch {
    setStatus('Network error while communicating with server.', true);
  }
});

cancelBtn.addEventListener('click', resetForm);

loadProducts();