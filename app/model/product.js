const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "نام مورد نیاز میباشد"],
    },
    summary: {
      type: String,
      required: [true, "نام خانوادگی شما مورد نیاز میباشد"],
    },
    description: {
      type: String,
      required: [true, "نام کاربری مورد نیاز میباشد"],
      unique: true,
    },
    imageCover: {
      type: String,
      required: true,
      default: "/uploads/products/imageCover/default.png",
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
      type: [mongoose.Schema.ObjectId],
      ref: "Categories",
      required: true,
    },
    comments: {
      type: [mongoose.Schema.ObjectId],
      ref: "Comments",
      required: true,
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: "Likes",
      required: true,
    },
    disLikes: {
      type: [mongoose.Schema.ObjectId],
      ref: "Dislikes",
      required: true,
    },
    bookmarks: {
      type: [mongoose.Schema.ObjectId],
      ref: "Bookmarks",
    },
    price: {
      type: Number,
      required: true,
    },
    profileImage: {
      type: String,
      default: "/uploads/users/profileImages/default.png",
    },
    discount: {
      type: String,
    },
    birthDate: {
      type: String,
    },
    type: {
      type: String,
      enum: ["video"],
    },
    details: {
      time: { type: String },
      format: { type: String, enum: [".mp4", ".mkv"] },
      teacher: { type: mongoose.Schema.ObjectId, ref: "Teachers" },
      properties: {
        length: { type: String },
        height: { type: String },
        width: { type: String },
        weight: { type: String },
        colors: { type: String },
        model: { type: String },
        madein: { type: String },
      },
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);
module.exports = {
  ProductModel,
};
