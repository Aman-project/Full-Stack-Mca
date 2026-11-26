const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 4.0
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);