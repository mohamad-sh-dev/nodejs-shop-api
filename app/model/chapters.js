const mongoose = require('mongoose');

const chapters = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  episods: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Episods',
    default: []
  },
});

module.exports = mongoose.model('Chapters', chapters);
