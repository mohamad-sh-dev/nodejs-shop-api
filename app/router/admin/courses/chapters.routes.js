const express = require('express');
const chaptersController = require('../../../http/controller/admin/courses/chapters.controller');
const { getDeleteChaptersSchema, updateChaptersSchema, createUpdateChaptersSchema } = require('../../../model/schemas/chapters.schema');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const { restrictTo } = require('../../../utilities/functions');
const { isAuthenticated } = require('../../../http/middlewares/authorization');
const { REQUEST_PARAMS } = require('../../../utilities/constants');

const { Router } = express;

const router = new Router();

// router.get('/', chaptersController.getChapter);

router.get('/:chapterId', validateRequestBody(getDeleteChaptersSchema, REQUEST_PARAMS), chaptersController.getChapter);

router.post(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    validateRequestBody(createUpdateChaptersSchema),
    chaptersController.createChapter
);
router.patch(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    validateRequestBody(updateChaptersSchema),
    chaptersController.updateChapter
);
router.delete(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    validateRequestBody(getDeleteChaptersSchema),
    chaptersController.removeChapter
);

module.exports = {
    adminChaptersRoutes: router
};
