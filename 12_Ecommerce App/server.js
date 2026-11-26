const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Admin credentials (override via environment variables if desired)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@brutalmart.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const activeAdminTokens = new Set();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Seed products written automatically when products.json is empty
const DEFAULT_PRODUCTS = [
  {
    id: 101,
    name: 'Wireless Mechanical Keyboard',
    price: 6499,
    category: 'Electronics',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    description: 'Compact 75% hot-swappable mechanical keyboard with tactile switches and dual wireless modes.'
  },
  {
    id: 102,
    name: 'Studio Noise-Canceling Headphones',
    price: 8999,
    category: 'Audio',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: 'Over-ear wireless headphones with 40-hour battery and deep acoustic isolation.'
  },
  {
    id: 103,
    name: 'Aluminum Laptop Riser',
    price: 2299,
    category: 'Workspace',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    description: 'Ergonomic ventilated stand compatible with 13-inch to 17-inch laptops.'
  }
];

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_FILE) || fs.readFileSync(PRODUCTS_FILE, 'utf8').trim() === '') {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(DEFAULT_PRODUCTS, null, 2), 'utf8');
  }
  if (!fs.existsSync(ORDERS_FILE) || fs.readFileSync(ORDERS_FILE, 'utf8').trim() === '') {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function readJson(filePath) {
  ensureStorage();
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  ensureStorage();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || !activeAdminTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized. Please log in to Admin Portal.' });
  }
  next();
}

ensureStorage();

// Serve SPA shell for /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- ADMIN AUTH ROUTES ---

app.post('/api/admin/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin email or password.' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  activeAdminTokens.add(token);
  res.json({ token, email: ADMIN_EMAIL });
});

app.get('/api/admin/verify', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || !activeAdminTokens.has(token)) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, email: ADMIN_EMAIL });
});

app.post('/api/admin/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) activeAdminTokens.delete(token);
  res.json({ ok: true });
});

// --- PRODUCT ROUTES ---

app.get('/api/products', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const products = readJson(PRODUCTS_FILE);
  const item = products.find(p => p.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json(item);
});

// Protected: Only authenticated admin can add products
app.post('/api/products', requireAdmin, (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const name = String(req.body.name || '').trim();
  const category = String(req.body.category || 'General').trim();
  const price = Number(req.body.price);
  const stock = Number(req.body.stock);
  const image = String(req.body.image || '').trim();
  const description = String(req.body.description || '').trim();

  if (!name || Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0 || !description) {
    return res.status(400).json({ error: 'Valid name, price, stock, and description are required.' });
  }

  const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 101;
  const newProduct = {
    id: nextId,
    name,
    category,
    price: Number(price.toFixed(2)),
    stock: Math.floor(stock),
    image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description
  };

  products.push(newProduct);
  writeJson(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

// Protected: Only authenticated admin can edit products
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const name = String(req.body.name || '').trim();
  const category = String(req.body.category || 'General').trim();
  const price = Number(req.body.price);
  const stock = Number(req.body.stock);
  const image = String(req.body.image || '').trim();
  const description = String(req.body.description || '').trim();

  if (!name || Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0 || !description) {
    return res.status(400).json({ error: 'Valid name, price, stock, and description are required.' });
  }

  products[index] = {
    ...products[index],
    name,
    category,
    price: Number(price.toFixed(2)),
    stock: Math.floor(stock),
    image: image || products[index].image,
    description
  };

  writeJson(PRODUCTS_FILE, products);
  res.json(products[index]);
});

// --- ORDER & PAYMENT ROUTES ---

app.get('/api/orders', (req, res) => {
  const orders = readJson(ORDERS_FILE);
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, paymentMethod, paymentDetails, items } = req.body;

  if (!customerName || !customerEmail || !paymentMethod || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Customer details, payment method, and cart items are required.' });
  }

  const products = readJson(PRODUCTS_FILE);
  const orders = readJson(ORDERS_FILE);

  let subtotal = 0;
  const purchasedItems = [];

  for (const cartItem of items) {
    const product = products.find(p => p.id === Number(cartItem.id));
    const qty = Number(cartItem.qty);

    if (!product || qty <= 0 || product.stock < qty) {
      return res.status(400).json({
        error: `Insufficient stock for "${product ? product.name : 'unknown item'}".`
      });
    }

    product.stock -= qty;
    const lineTotal = Number((product.price * qty).toFixed(2));
    subtotal += lineTotal;

    purchasedItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
      lineTotal
    });
  }

  const newOrder = {
    orderId: `ORD-${Date.now()}`,
    customerName: String(customerName).trim(),
    customerEmail: String(customerEmail).trim(),
    paymentMethod: String(paymentMethod).trim(),
    paymentReference: String(paymentDetails || 'Verified').trim(),
    items: purchasedItems,
    totalAmount: Number(subtotal.toFixed(2)),
    status: 'Paid & Confirmed',
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJson(PRODUCTS_FILE, products);
  writeJson(ORDERS_FILE, orders);

  res.status(201).json(newOrder);
});

// --- JSON STORAGE INSPECTOR ENDPOINT ---

app.get('/api/storage-info', requireAdmin, (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const orders = readJson(ORDERS_FILE);
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const totalUnits = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);

  res.json({
    files: {
      productsPath: 'data/products.json',
      ordersPath: 'data/orders.json'
    },
    stats: {
      productCount: products.length,
      orderCount: orders.length,
      totalStockUnits: totalUnits,
      totalRevenue: Number(totalRevenue.toFixed(2))
    },
    productsPreview: products,
    ordersPreview: orders
  });
});

app.listen(PORT, () => {
  console.log(`BRUTAL MART running at http://localhost:${PORT}`);
  console.log(`Admin Portal at http://localhost:${PORT}/admin (${ADMIN_EMAIL} / ${ADMIN_PASSWORD})`);
});