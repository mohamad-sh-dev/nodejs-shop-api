const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'عنوان وبلاگ مورد نیاز میباشد'],
    },
    summary: {
      type: String,
      required: [true, 'توضیح کوتاه مورد نیاز میباشد'],
    },
    body: {
      type: String,
      required: [true, 'متن وبلاگ مورد نیاز میباشد'],
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
      ref: 'Categories',
      required: [true, 'دسته بندی مورد نیاز میباشد'],
    },
    comments: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Comments',
      default: [],
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Likes',
      default: [],
    },
    disLikes: {
      type: [mongoose.Schema.ObjectId],
      ref: 'DisLikes',
      default: [],
    },
    bookmarks: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Bookmarks',
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
