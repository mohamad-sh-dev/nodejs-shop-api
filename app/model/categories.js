const mongoose = require("mongoose");
const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    } ,
    parentCategory : {
      type : mongoose.Schema.Types.ObjectId ,
      ref : 'Category' ,
      default : null
    } ,
    subCategory : [{
      type : mongoose.Schema.Types.ObjectId ,
      ref : 'Category'
    }]
  },
  {
    timestamps: true,
  }
);
const CategoryModel = mongoose.model("Category", categoriesSchema);
module.exports = {
  CategoryModel
}
