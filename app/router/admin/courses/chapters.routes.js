const express = require('express');
const chaptersController = require('../../../http/controller/admin/courses/chapters.controller');
const { getDeleteChaptersSchema, updateChaptersSchema, createUpdateChaptersSchema } = require('../../../model/schemas/chapters.schema');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const { REQUEST_PARAMS } = require('../../../utilities/constants');

const { Router } = express;

const router = new Router();

// router.get('/', chaptersController.getChapter);

router.get('/:chapterId', validateRequestBody(getDeleteChaptersSchema, REQUEST_PARAMS), chaptersController.getChapter);

router.post(
    '/',
    validateRequestBody(createUpdateChaptersSchema),
    chaptersController.createChapter
);
router.patch(
    '/',
    validateRequestBody(updateChaptersSchema),
    chaptersController.updateChapter
);
router.delete(
    '/',
    validateRequestBody(getDeleteChaptersSchema),
    chaptersController.removeChapter
);

module.exports = {
    adminChaptersRoutes: router
};
