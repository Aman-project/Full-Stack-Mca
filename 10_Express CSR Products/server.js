const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies and serve static client-side files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory product store (id, name, price in INR, rating)
let products = [
  { id: 1, name: 'Mechanical Keyboard', price: 7499, rating: 4.8 },
  { id: 2, name: 'USB-C Monitor Stand', price: 4599, rating: 4.5 },
  { id: 3, name: 'Wireless Ergonomic Mouse', price: 2499, rating: 4.6 }
];

let nextId = 4;

// GET /api/products — Return all products as JSON
app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

// GET /api/products/:id — Return a single product by ID
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(item => item.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(200).json(product);
});

// POST /api/products — Validate and create a new product
app.post('/api/products', (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const price = Number(req.body.price);
  const rating = Number(req.body.rating);

  if (!name) {
    return res.status(400).json({ error: 'Product name is required.' });
  }

  if (Number.isNaN(price) || price < 0) {
    return res.status(400).json({ error: 'Price must be a valid non-negative number.' });
  }

  if (Number.isNaN(rating) || rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be a number between 0 and 5.' });
  }

  const created = {
    id: nextId++,
    name,
    price: Number(price.toFixed(2)),
    rating: Number(rating.toFixed(1))
  };

  products.push(created);
  res.status(201).json(created);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});