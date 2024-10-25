const mongoose = require('mongoose');

const { Schema } = mongoose;


const shopUser = new Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  first_name: String,
  last_name: String,
  street_address: String,
  city: String,
  state: String,
  postal_code: String,
  country: String,
  is_superuser: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Category Schema
const categorySchema = new Schema({
  name: { type: String, required: true },
  cat_type: {type: String, required: true, enum: ['services', 'productis']},
  description: String
});
categorySchema.index({ name: 1, cat_type: 1 }, { unique: true });

const imageSchema = new Schema({
  imageData: { type: Buffer, required: true },
  contentType: { type: String, required: true }  // Specifies the MIME type of the image
});

// Product Schema
const productSchema = new Schema({
  category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String, required: true },
  shortDescription: String,
  description: String,
  price: { type: Number, required: true },
  stock_quantity: Number,
  total_sold: { type: Number, default: 0 },
  images: [imageSchema],  // Array of images
  created_at: { type: Date, default: Date.now },
  updated_at: { date: { type: Date, default: Date.now }, message: String }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user: {
    name: String,
    address: String,
    email: String,
    phone: String
  },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
  }],
  total: Number, 
  status:{type: String, required: true, enum: ['pending', 'completed', 'canceled'], default: 'Pending' }, // Default status as 'Pending'
  createdAt: { type: Date, default: Date.now }
});


// Models
const User = mongoose.model('User', shopUser);
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  User,
  Category,
  Product,
  Order,
};
