const { Router } = require('express');
const userController = require('../../http/controller/user/user.controller');
const { fileUpload } = require('../../utilities/multerConfig');
const { UPLOADS_ENTITIES, UPLOAD_FIELD_NAMES } = require('../../utilities/constants');

const router = new Router();

router.get('/list', userController.getListOfUsers);
router.get('/', userController.getProfile);
router.patch('/', fileUpload(UPLOADS_ENTITIES.USER).single(UPLOAD_FIELD_NAMES.PROFILE_IMAGE), userController.updateProfile);
router.delete('/', userController.removeUser);

module.exports = {
    userRoutes: router
};
