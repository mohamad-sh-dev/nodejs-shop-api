const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    subCategory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: []
    }]
  },
  {
    id: 0,
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);
categoriesSchema.virtual('subCategoryDetails', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
});

function autoPopulate(next) {
  this.populate({ path: 'subCategoryDetails', select: { name: 1 } });
  next();
}
categoriesSchema.pre('find', autoPopulate).pre('findOne', autoPopulate);

const CategoryModel = mongoose.model('Category', categoriesSchema);
module.exports = {
  CategoryModel
};
