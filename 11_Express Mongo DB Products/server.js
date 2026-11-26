require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/product_store';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/products — Read all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — Read a single product by ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// POST /api/products — Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      price: Number(req.body.price),
      rating: Number(req.body.rating),
      description: req.body.description
    });
    res.status(201).json(product);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id — Update an existing product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        price: Number(req.body.price),
        rating: Number(req.body.rating),
        description: req.body.description
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id — Delete a product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted', id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });