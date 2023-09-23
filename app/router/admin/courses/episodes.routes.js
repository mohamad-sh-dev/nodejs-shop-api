const express = require('express');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const {
 getDeleteEpisodesSchema, createUpdateEpisodesSchema, getEpisodesOfChapterSchema, updateEpisodesSchema
} = require('../../../model/schemas/episodes');
const episdoesController = require('../../../http/controller/admin/courses/episdoes.controller');
const { videoUpload } = require('../../../utilities/multerConfig');
const {
 REQUEST_QUERY, REQUEST_BODY, UPLOAD_FIELD_NAMES, REQUEST_PARAMS, UPLOADS_ENTITIES
} = require('../../../utilities/constants');

const { Router } = express;

const router = new Router();

// router.get('/', chaptersController.getChapter);

router.get('/:episodeId', validateRequestBody(getDeleteEpisodesSchema, REQUEST_PARAMS), episdoesController.getOneEpisode);

router.get(
    '/',
    validateRequestBody(getEpisodesOfChapterSchema, REQUEST_QUERY),
    episdoesController.getEpisodesListOfChapter
);
router.post(
    '/',
    videoUpload(UPLOADS_ENTITIES.EPISODES).single(UPLOAD_FIELD_NAMES.VIDEOS),
    validateRequestBody(createUpdateEpisodesSchema, REQUEST_BODY),
    episdoesController.createEpisode
);
router.patch(
    '/',
    videoUpload(UPLOADS_ENTITIES.EPISODES).single(UPLOAD_FIELD_NAMES.VIDEOS),
    validateRequestBody(updateEpisodesSchema, REQUEST_BODY),
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
