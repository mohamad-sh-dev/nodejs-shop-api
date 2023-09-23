const { Router } = require('express');
const blogController = require('../../../http/controller/admin/blogs/blog.controller');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const { createUpdateBlogsSchema, getDeleteBlogsSchema } = require('../../../model/schemas/blogs.schema');
const { fileUpload } = require('../../../utilities/multerConfig');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');
const { UPLOADS_ENTITIES, REQUEST_BODY_FIELD_NAMES, UPLOAD_FIELD_NAMES } = require('../../../utilities/constants');

const router = new Router();
router.get(
  '/',
  blogController.getBlogsLists
);
router.post(
  '/',
  fileUpload(UPLOADS_ENTITIES.BLOGS).single(UPLOAD_FIELD_NAMES.IMAGE),
  parseToJsonArray([REQUEST_BODY_FIELD_NAMES.TAGS, REQUEST_BODY_FIELD_NAMES.CATEGORIES]),
  validateRequestBody(createUpdateBlogsSchema),
  blogController.createBlog
);
router.patch(
  '/',
  fileUpload(UPLOADS_ENTITIES.BLOGS).single(UPLOAD_FIELD_NAMES.IMAGE),
  parseToJsonArray([REQUEST_BODY_FIELD_NAMES.TAGS, REQUEST_BODY_FIELD_NAMES.CATEGORIES]),
  validateRequestBody(createUpdateBlogsSchema),
  blogController.updateBlog
);
router.delete(
  '/',
  validateRequestBody(getDeleteBlogsSchema),
  blogController.deleteBlog
);

module.exports = {
  adminBlogsRoutes: router,
};
