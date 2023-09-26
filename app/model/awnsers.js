const mongoose = require('mongoose');

const awnsers = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    awnser: {
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
const AwnsersModel = mongoose.model('Awnsers', awnsers);

module.exports = {
    AwnsersModel,
};
