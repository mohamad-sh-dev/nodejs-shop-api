const mongoose = require("mongoose");
const categories = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);
const CategoryModel = mongoose.model("Category", categories);
module.exports = {
  CategoryModel,
};
