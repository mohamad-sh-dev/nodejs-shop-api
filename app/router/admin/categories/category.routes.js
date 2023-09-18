const { Router } = require('express');
const { isAuthenticated } = require('../../../http/middlewares/authorization');
const categoryController = require('../../../http/controller/admin/categories/category.controller');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const { getDeleteCategorySchema, createUpdateCategorySchema } = require('../../../model/schemas/categories.schema');
const { REQUEST_PARAMS } = require('../../../utilities/constants');

const router = new Router();
router.get(
  '/categories/list',
  isAuthenticated,
  categoryController.getCategoriesList
);

router.post('/categories', isAuthenticated, validateRequestBody(createUpdateCategorySchema), categoryController.createCategory);

router.get(
  '/categories/:categoryId',
  isAuthenticated,
  validateRequestBody(getDeleteCategorySchema, REQUEST_PARAMS),
  categoryController.getCategory
);
router.get(
  '/categories',
  isAuthenticated,
  categoryController.getAllCategories
);

router.patch('/categories', isAuthenticated, validateRequestBody(createUpdateCategorySchema), categoryController.updateCategory);

router.delete('/categories/:id', isAuthenticated, validateRequestBody(getDeleteCategorySchema, REQUEST_PARAMS), categoryController.deleteCategory);

module.exports = {
  adminPanelRoutes: router,
};
