const { Router } = require('express');
const userController = require('../../http/controller/user/user.controller');
const { fileUpload } = require('../../utilities/multerConfig');

const router = new Router();

router.get('/list', userController.getListOfUsers);
router.get('/', userController.getProfile);
router.patch('/', fileUpload('user').single('profileImage'), userController.updateProfile);
router.delete('/', userController.removeUser);

module.exports = {
    userRoutes: router
};
