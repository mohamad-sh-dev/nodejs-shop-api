const { Router } = require('express');
const blogController = require('../../../http/controller/admin/blogs/blog.controller');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const { createUpdateBlogsSchema, getDeleteBlogsSchema } = require('../../../model/schemas/blogs.schema');
const { fileUpload } = require('../../../utilities/multerConfig');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');

const router = new Router();
router.get(
  '/',
  blogController.getBlogsLists
);
router.post(
  '/',
  fileUpload('blogs').single('image'),
  parseToJsonArray(['tag', 'categories']),
  validateRequestBody(createUpdateBlogsSchema),
  blogController.createBlog
);
router.patch(
  '/',
  fileUpload('blogs').single('image'),
  parseToJsonArray(['tag', 'categories']),
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
