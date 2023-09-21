const express = require('express');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
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
    videoUpload('episodes').single('video'),
    validateRequestBody(createUpdateEpisodesSchema, 'body'),
    episdoesController.createEpisode
);
router.patch(
    '/',
    videoUpload('episodes').single('video'),
    validateRequestBody(updateEpisodesSchema, 'body'),
    episdoesController.updateEpisode
);
router.delete(
    '/',
    validateRequestBody(getDeleteEpisodesSchema),
    episdoesController.removeEpisode
);

module.exports = {
    adminEpisodesRoutes: router
};
