const mongoose = require('mongoose');

const episods = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: '00:00:00',
        required: true
    },
    type: {
        type: String,
        default: 'free'
    },
});

module.exports = mongoose.model('Episods', episods);
