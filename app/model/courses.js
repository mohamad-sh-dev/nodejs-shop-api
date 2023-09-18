/* eslint-disable no-await-in-loop */
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const { messageCenter } = require('../utilities/messages');
const { convertStringTimeToSeconds, getVideoTime } = require('../utilities/getVideoTime');
const { ChapterModel } = require('./chapters');

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
      type: Number,
    },
    type: {
      type: String,
      default: 'free',
      required: true
    },
    chapters: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Chapters',
      default: []
    },
    duration: { type: String, default: '00:00:00' },
    teacher: { type: mongoose.Schema.ObjectId, ref: 'Teachers', required: true },
    students: { type: [mongoose.Schema.ObjectId], ref: 'User', default: [] },
  },
  {
    timestamps: true,
  }
);

courseSchema.pre('save', function (next) {
  if (this.type === 'free') {
    this.price = 0;
    this.discount = 0;
  }
  next();
});

courseSchema.statics.updateCourseDuration = async function (courseId) {
  let totalEpisodeSeconds = 0;
  const course = await this.findById(courseId);
  if (!course) {
    throw createHttpError.NotFound(messageCenter.public.notFoundContent);
  }
  for (let i = 0; i < course.chapters.length; i += 1) {
    const chapterDocument = await ChapterModel.findById(course.chapters[i].toString());
    const { duration } = chapterDocument;
    totalEpisodeSeconds += convertStringTimeToSeconds(duration);
  }
  course.duration = getVideoTime(totalEpisodeSeconds);
  course.save();
};

const CourseModel = mongoose.model('Course', courseSchema);
module.exports = {
  CourseModel,
};
