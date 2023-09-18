const mongoose = require('mongoose');

const episodesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        default: '00:00:00',
    },
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['lock', 'unlock'],
        default: 'unlock'
    },
    chapterId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chapter',
        required: true
    }
});
const EpisodeModel = mongoose.model('Episodes', episodesSchema);

module.exports = {
    EpisodeModel,
};
