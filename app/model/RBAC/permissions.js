/* eslint-disable func-names */
const mongoose = require('mongoose');

const permissionsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    methods: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

permissionsSchema.pre('aggregate', function (next) {
    this.project('-createdAt -updatedAt -__v');
    next();
});

permissionsSchema.pre('find', function (next) {
    this.select('-createdAt -updatedAt -__v');
    next();
});
permissionsSchema.index({ title: 'text', description: 'text' });
const PermissionsModel = mongoose.model('Permissions', permissionsSchema);

module.exports = {
    PermissionsModel,
};
