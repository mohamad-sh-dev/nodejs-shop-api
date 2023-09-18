const express = require('express');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const { restrictTo } = require('../../../utilities/functions');
const { isAuthenticated } = require('../../../http/middlewares/authorization');
const {
 getDeleteEpisodesSchema, createUpdateEpisodesSchema, getEpisodesOfChapterSchema, updateEpisodesSchema
} = require('../../../model/schemas/episodes');
const episdoesController = require('../../../http/controller/admin/courses/episdoes.controller');
const { videoUpload } = require('../../../utilities/multerConfig');

const { Router } = express;

const router = new Router();

// router.get('/', chaptersController.getChapter);

router.get('/:episodeId', validateRequestBody(getDeleteEpisodesSchema, 'params'), episdoesController.getOneEpisode);

router.get(
    '/',
    validateRequestBody(getEpisodesOfChapterSchema, 'query'),
    episdoesController.getEpisodesListOfChapter
);
router.post(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    videoUpload('episodes').single('video'),
    validateRequestBody(createUpdateEpisodesSchema, 'body'),
    episdoesController.createEpisode
);
router.patch(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    videoUpload('episodes').single('video'),
    validateRequestBody(updateEpisodesSchema, 'body'),
    episdoesController.updateEpisode
);
router.delete(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    validateRequestBody(getDeleteEpisodesSchema),
    episdoesController.removeEpisode
);

module.exports = {
    adminEpisodesRoutes: router
};
