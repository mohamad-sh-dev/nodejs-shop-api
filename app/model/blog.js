const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    image: {
      type: String
    },
    tag: {
      type: [String]
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true
    },
    comments: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Comments',
      default: [],
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      default: [],
    },
    disLikes: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      default: [],
    },
    bookmarks: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      default: [],
    }
  },
  {
    timestamps: true,
  }
);
const BlogModel = mongoose.model('Blog', blogSchema);
module.exports = {
  BlogModel,
};
