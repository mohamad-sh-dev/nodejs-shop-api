const mongoose = require('mongoose');
const { PRODUCT_TYPES } = require('../utilities/constants');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageCover: {
      type: String,
      required: true,
      default: '/uploads/products/imageCover/default.png',
    },
    images: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    bookmarks: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
    },
    comments: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Comments',
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    discount: {
      type: Number,
    },
    type: {
      type: String,
      enum: PRODUCT_TYPES
    },
    suplier: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    properties: {
      length: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      weight: { type: Number },
      colors: { type: String },
      model: { type: String },
      madein: { type: String },

    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      required: true,
    },
    disLikes: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  title: 'text', summary: 'text', description: 'text', tags: 'text', type: 'text',
});

const ProductModel = mongoose.model('Product', productSchema);
module.exports = {
  ProductModel,
};
