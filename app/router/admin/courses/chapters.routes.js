const express = require('express');
const chaptersController = require('../../../http/controller/admin/courses/chapters.controller');
const { getDeleteChaptersSchema, updateChaptersSchema, createUpdateChaptersSchema } = require('../../../model/schemas/chapters.schema');
const { validateRequestBody, validateRequestParams } = require('../../../http/validations/auth.schema');
const { restrictTo } = require('../../../utilities/functions');
const { isAuthenticated } = require('../../../http/middlewares/authorization');

const { Router } = express;

const router = new Router();

// router.get('/', chaptersController.getChapter);

router.get('/:chapterId', validateRequestParams(getDeleteChaptersSchema), chaptersController.getChapter);

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
