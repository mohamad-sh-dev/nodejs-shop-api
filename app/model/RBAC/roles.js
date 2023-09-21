const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    permissions: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Permissions',
        default: []
    }
});

rolesSchema.index({ name: 'text' });

const RolesModel = mongoose.model('Roles', rolesSchema);

module.exports = {
    RolesModel,
};
