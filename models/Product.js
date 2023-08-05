const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
});

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, //color name
  price: { type: Number, required: true }, // price
  image: { type: String }, // there wil be a single image
});

const imageSchema = new mongoose.Schema({
  image: { type: String }, // there wil be a single image
  // image: [{ type: String }],
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  uid: {
    // sellerid
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // images: [imageSchema],
  images: {
    type: Array,
    default: [],
  },
  variants: [variantSchema],
  reviews: [reviewSchema],
});

const Product = mongoose.model("PRODUCT", productSchema);

module.exports = Product;
