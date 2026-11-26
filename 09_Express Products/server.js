const path = require('path');
const express = require('express');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS view engine and middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory product store (prices in INR + image links)
let products = [
  {
    id: 1,
    name: 'Mechanical Keyboard',
    price: 7499.00,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    description: 'Compact 75% wireless keyboard with tactile switches and aluminum frame.'
  },
  {
    id: 2,
    name: 'USB-C Monitor Stand',
    price: 4599.00,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    description: 'Elevated desk riser with integrated 65W USB-C hub and SD card reader.'
  }
];

let nextId = 3;

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Redirect root to RESTful index route
app.get('/', (req, res) => {
  res.redirect('/products');
});

// INDEX: List all products
app.get('/products', (req, res) => {
  res.render('index', {
    pageTitle: 'Products',
    products
  });
});

// NEW: Show form to create a product
app.get('/products/new', (req, res) => {
  res.render('new', {
    pageTitle: 'New Product',
    error: null,
    formData: { name: '', price: '', image: '', description: '' }
  });
});

// CREATE: Add a new product
app.post('/products', (req, res) => {
  const name = (req.body.name || '').trim();
  const price = Number(req.body.price);
  const image = (req.body.image || '').trim();
  const description = (req.body.description || '').trim();

  if (!name || Number.isNaN(price) || price < 0 || !isValidHttpUrl(image) || !description) {
    return res.status(400).render('new', {
      pageTitle: 'New Product',
      error: 'Provide a valid product name, non-negative price (₹), valid http/https image URL, and description.',
      formData: { name, price: req.body.price || '', image, description }
    });
  }

  const created = {
    id: nextId++,
    name,
    price: Number(price.toFixed(2)),
    image,
    description
  };

  products.push(created);
  res.redirect(`/products/${created.id}`);
});

// SHOW: Display single product details
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(item => item.id === id);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  res.render('show', {
    pageTitle: product.name,
    product
  });
});

// EDIT: Show form to edit an existing product
app.get('/products/:id/edit', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(item => item.id === id);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  res.render('edit', {
    pageTitle: `Edit ${product.name}`,
    error: null,
    product
  });
});

// UPDATE: Replace product fields via PUT
app.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).send('Product not found');
  }

  const name = (req.body.name || '').trim();
  const price = Number(req.body.price);
  const image = (req.body.image || '').trim();
  const description = (req.body.description || '').trim();

  if (!name || Number.isNaN(price) || price < 0 || !isValidHttpUrl(image) || !description) {
    return res.status(400).render('edit', {
      pageTitle: `Edit ${products[index].name}`,
      error: 'Provide a valid product name, non-negative price (₹), valid http/https image URL, and description.',
      product: { id, name, price: req.body.price || '', image, description }
    });
  }

  products[index] = {
    id,
    name,
    price: Number(price.toFixed(2)),
    image,
    description
  };

  res.redirect(`/products/${id}`);
});

// DELETE: Remove a product via DELETE
app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  products = products.filter(item => item.id !== id);
  res.redirect('/products');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});