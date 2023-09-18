/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
const createHttpError = require('http-errors');
const { EpisodeModel } = require('./episods');
const { convertStringTimeToSeconds, getVideoTime } = require('../utilities/getVideoTime');
const { messageCenter } = require('../utilities/messages');

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  episodes: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Episodes',
    default: []
  },
  duration: { type: String, default: '00:00:00' },
});

// chapterSchema.pre('updateOne', async function (next) {
//   let totalEpisodeSeconds = 0;
//   try {
//     for (let i = 0; i < doc.episodes.length; i++) {
//       console.log(doc.episodes[i]);
//       const episodeDocument = await EpisodeModel.findById(doc.episodes[i].toString());
//       const { duration } = episodeDocument;
//       totalEpisodeSeconds += convertStringTimeToSeconds(duration);
//     }
//     doc.duration = getVideoTime(totalEpisodeSeconds);
//     doc.save()
//     next();
//   } catch (error) {
//     next(error)
//   }
// });

chapterSchema.statics.updateChapterDuration = async function (chapterId) {
  let totalEpisodeSeconds = 0;
  const chapter = await this.findById(chapterId);
  if (!chapter) {
    throw createHttpError.NotFound(messageCenter.public.notFoundContent);
  }
  for (let i = 0; i < chapter.episodes.length; i += 1) {
    const episodeDocument = await EpisodeModel.findById(chapter.episodes[i].toString());
    const { duration } = episodeDocument;
    totalEpisodeSeconds += convertStringTimeToSeconds(duration);
  }
  chapter.duration = getVideoTime(totalEpisodeSeconds);
  chapter.save();
};

module.exports = {
  ChapterModel: mongoose.model('Chapters', chapterSchema)
};
