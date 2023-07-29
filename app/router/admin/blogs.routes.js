const { Router } = require('express');
const { isAuthenticated } = require('../../http/middlewares/authorization');
const blogController = require('../../http/controller/admin/blog.controller');
const { validateRequestBody } = require('../../http/validations/auth.schema');
const { createUpdateBlogsSchema, getDeleteBlogsSchema } = require('../../model/schemas/blogs.schema');
const { upload } = require('../../utilities/multerConfig');
const parseToJsonArray = require('../../http/middlewares/jsonArrayPars');
const { restrictTo } = require('../../utilities/functions');

const router = new Router();
router.get(
  '/',
  blogController.getBlogsLists
);
router.post(
  '/',
  isAuthenticated,
  restrictTo('ADMIN'),
  upload.single('image'),
  parseToJsonArray(['tag', 'categories']),
  validateRequestBody(createUpdateBlogsSchema),
  blogController.createBlog
);
router.patch(
  '/',
  isAuthenticated,
  restrictTo('ADMIN'),
  upload.single('image'),
  parseToJsonArray(['tag', 'categories']),
  validateRequestBody(createUpdateBlogsSchema),
  blogController.updateBlog
);
router.delete(
  '/',
  isAuthenticated,
  restrictTo('ADMIN'),
  validateRequestBody(getDeleteBlogsSchema),
  blogController.deleteBlog
);

module.exports = {
  adminBlogsRoutes: router,
};
