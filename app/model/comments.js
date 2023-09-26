const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    replyedOnce: {
        type: Boolean,
        default: false
    },
    source: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    awnser: {
        type: mongoose.Schema.ObjectId,
        ref: 'Awnsers',
    }
}, {
    virtuals: true,
    timestamps: true
});

commentsSchema.virtual('Blogs', {
    ref: 'Blogs',
    foreignField: '_id',
    localField: 'source',
    justOne: true
});
commentsSchema.virtual('Courses', {
    ref: 'Courses',
    foreignField: '_id',
    localField: 'source',
    justOne: true
});
const CommentsModel = mongoose.model('Comments', commentsSchema);

module.exports = {
    CommentsModel,
};
