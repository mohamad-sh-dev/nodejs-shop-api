const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'نام مورد نیاز میباشد'],
    },
    summary: {
      type: String,
      required: [true, 'نام خانوادگی شما مورد نیاز میباشد'],
    },
    description: {
      type: String,
      required: [true, 'نام کاربری مورد نیاز میباشد'],
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
      ref: 'Bookmarks',
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    discount: {
      type: String,
    },
    type: {
      type: String,
      enum: ['virtual', 'phicycal'],
    },
    suplier: {
      type: mongoose.Schema.ObjectId,
      ref: 'Suplier',
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
