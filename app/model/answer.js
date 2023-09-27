const mongoose = require('mongoose');

const answers = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    parentComment: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Comments'
    }
}, {
    timestamps: true
});
const AnswersModel = mongoose.model('Answers', answers);

module.exports = {
    AnswersModel,
};
