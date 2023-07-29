const { Router } = require('express');
const { isAuthenticated } = require('../../http/middlewares/authorization');
const categoryController = require('../../http/controller/admin/category.controller');
const { validateRequestBody, validateRequestParams } = require('../../http/validations/auth.schema');
const { getDeleteCategorySchema, createUpdateCategorySchema } = require('../../model/schemas/categories.schema');

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
  validateRequestParams(getDeleteCategorySchema),
  categoryController.getCategory
);
router.get(
  '/categories',
  isAuthenticated,
  categoryController.getAllCategories
);

router.put('/categories', isAuthenticated, validateRequestBody(createUpdateCategorySchema), categoryController.updateCategory);

router.delete('/categories/:id', isAuthenticated, validateRequestParams(getDeleteCategorySchema), categoryController.deleteCategory);

router.get('/create');
module.exports = {
    adminPanelRoutes: router,
};
