const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
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
    image: {
      type: String,
      required: true,
      default: '/uploads/courses/images/default.png',
    },
    tags: {
      type: [String],
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Categories',
      required: true,
    },
    comments: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Comments',
      required: true,
    },
    likes: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Likes',
      required: true,
    },
    disLikes: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Dislikes',
      required: true,
    },
    bookmarks: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Bookmarks',
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: String,
    },
    type: {
      type: String,
      default: 'free',
      required: true
    },
    time: { type: String, default: '00:00:00' },
    format: { type: String, enum: ['.mp4', '.mkv'] },
    teacher: { type: mongoose.Schema.ObjectId, ref: 'Teachers' },
    chapters: { type: [mongoose.Schema.ObjectId], ref: 'Chapter', default: [] },
    students: { type: [mongoose.Schema.ObjectId], ref: 'User', default: [] },
  },
  {
    timestamps: true,
  }
);

const CourseModel = mongoose.model('Course', courseSchema);
module.exports = {
  CourseModel,
};
